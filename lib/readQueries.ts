"use cache"
import {Event, Location, MatchPlan, MatchResult, Score, Team} from "@prisma/client";
import {prisma} from "./prisma";

export async function getAllEvents(): Promise<Event[]> {
    const rawEvents: Event[] = await prisma.event.findMany()
    return rawEvents.sort((a, b) => a.id - b.id)
}

export async function getAllLocations(): Promise<Location[]> {
    const rawLocations: Location[] = await prisma.location.findMany()
    return rawLocations.sort((a, b) => a.id - b.id)
} 

export async function getAllMatchPlans(): Promise<MatchPlan[]> {
    const rawPlans: MatchPlan[] = await prisma.matchPlan.findMany()
    return rawPlans.sort((a, b) => a.id - b.id)
}

export async function getAllMatchResults(): Promise<Record<string, MatchResult>> {
    const matchResults: MatchResult[] = await prisma.matchResult.findMany()
    // <matchId>: {}の形にする
    const matchResultsMap: Record<string, MatchResult> = {}
    matchResults.forEach((matchResult) => {
        matchResultsMap[matchResult.matchId.toString()] = matchResult
    })
    return matchResultsMap
}

export async function getAllScores(): Promise<Score[]> {
    const scores: Score[] = await prisma.score.findMany()
    return scores.sort((a, b) => a.id - b.id)
}

export async function getAllTeams(): Promise<Team[]> {
    const teams: Team[] = await prisma.team.findMany()
    return teams.sort((a, b) => a.id - b.id)
}