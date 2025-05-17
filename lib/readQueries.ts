"use cache"
import {Event, Location, MatchPlan, MatchResult, Score, Team} from "@prisma/client";
import {prisma} from "./prisma";
import {cacheTag} from "next/dist/server/use-cache/cache-tag";
import {cacheLife} from "next/dist/server/use-cache/cache-life";

export async function getAllEvents(): Promise<Event[]> {
    cacheTag('events');
    cacheLife('minutes')
    const rawEvents: Event[] = await prisma.event.findMany()
    return rawEvents.sort((a, b) => a.id - b.id)
}


export async function getEventById(eventId: number): Promise<Event | null> {
    cacheTag('events');
    cacheLife('minutes')
    const event: Event | null = await prisma.event.findUnique({
        where: {id: eventId}
    })
    return event
}


export async function getAllLocations(): Promise<Location[]> {
    cacheTag('locations');
    cacheLife('max')
    const rawLocations: Location[] = await prisma.location.findMany()
    return rawLocations.sort((a, b) => a.id - b.id)
}

export async function getAllMatchPlans(): Promise<MatchPlan[]> {
    cacheTag('matchPlans');
    cacheLife('minutes')
    const rawPlans: MatchPlan[] = await prisma.matchPlan.findMany()
    return rawPlans.sort((a, b) => a.id - b.id)
}

export async function getMatchThatDependsOn(eventId: number, matchId: number): Promise<MatchPlan[]> {
    cacheTag('matchPlans');
    cacheLife('minutes')
    const dependsOnMatchPlans: MatchPlan[] = await prisma.matchPlan.findMany({
        where: {
            eventId,
            status: 'Waiting',
            teamIds: {
                hasSome: [`$T-${matchId}-W`, `$T-${matchId}-L`]
            }
        }
    });
    return dependsOnMatchPlans
}


export async function getAllMatchResults(): Promise<Record<string, MatchResult>> {
    cacheTag('matchResults');
    cacheLife('minutes')
    const matchResults: MatchResult[] = await prisma.matchResult.findMany()
    // <matchId>: {}の形にする
    const matchResultsMap: Record<string, MatchResult> = {}
    matchResults.forEach((matchResult) => {
        matchResultsMap[matchResult.matchId.toString()] = matchResult
    })
    return matchResultsMap
}

export async function getAllScores(): Promise<Score[]> {
    cacheTag('scores');
    cacheLife('minutes')
    const scores: Score[] = await prisma.score.findMany()
    return scores.sort((a, b) => a.id - b.id)
}

export async function getAllTeams(): Promise<Team[]> {
    cacheTag('teams');
    cacheLife('max')
    const teams: Team[] = await prisma.team.findMany()
    return teams.sort((a, b) => a.id - b.id)
}