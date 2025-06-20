"use cache";
import type {Event, Location, MatchPlan, MatchResult, Score, Team,} from "@prisma/client";
import {cacheLife} from "next/dist/server/use-cache/cache-life";
import {cacheTag} from "next/dist/server/use-cache/cache-tag";
import {prisma} from "./prisma";

export async function getAllEvents(): Promise<Event[]> {
	cacheTag("events");
	cacheLife("seconds");
	const rawEvents: Event[] = await prisma.event.findMany();
	return rawEvents.sort((a, b) => a.id - b.id);
}

export async function getEventById(eventId: number): Promise<Event | null> {
	cacheTag("events");
	cacheLife("seconds");
	const event: Event | null = await prisma.event.findUnique({
		where: { id: eventId },
	});
	return event;
}

export async function getAllLocations(): Promise<Location[]> {
	cacheTag("locations");
	cacheLife("max");
	const rawLocations: Location[] = await prisma.location.findMany();
	return rawLocations.sort((a, b) => a.id - b.id);
}

export async function getAllMatchPlans(): Promise<MatchPlan[]> {
	cacheTag("matchPlans");
	cacheLife("seconds");
	const rawPlans: MatchPlan[] = await prisma.matchPlan.findMany();
	return rawPlans.sort((a, b) => a.id - b.id);
}

export async function getMatchThatDependsOn(
	eventId: number,
	matchId: number,
): Promise<MatchPlan[]> {
	cacheTag("matchPlans");
	cacheLife("seconds");
	return await prisma.matchPlan.findMany({
		where: {
			eventId,
			status: "Waiting",
			teamIds: {
				hasSome: [`$T-${matchId}-W`, `$T-${matchId}-L`],
			},
		},
	});
}

export async function getAllMatchResults(): Promise<
	Record<string, MatchResult>
> {
	cacheTag("matchResults");
	cacheLife("seconds");
	const matchResults: MatchResult[] = await prisma.matchResult.findMany();
	// <matchId>: {}の形にする
	const matchResultsMap: Record<string, MatchResult> = {};
	matchResults.forEach((matchResult) => {
		matchResultsMap[matchResult.matchId.toString()] = matchResult;
	});
	return matchResultsMap;
}

export async function getAllScores(): Promise<Score[]> {
	cacheTag("scores");
	cacheLife("seconds");
	const scores: Score[] = await prisma.score.findMany();
	return scores.sort((a, b) => a.id - b.id);
}

export async function getAllTeams(): Promise<Team[]> {
	cacheTag("teams");
	cacheLife("max");
	const teams: Team[] = await prisma.team.findMany();
	return teams.sort((a, b) => a.id - b.id);
}
