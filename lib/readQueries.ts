"use cache"
import {Event, MatchPlan} from "@prisma/client";
import {prisma} from "./prisma";

export async function getAllEvents(): Promise<Event[]> {
    const rawEvents: Event[] = await prisma.event.findMany()
    return rawEvents.sort((a, b) => a.id - b.id)
}

export async function getAllLocations(): Promise<Location[]> {
    const rawLocations: Location[] = await prisma.location.findMany()
    
} 

export async function getAllMatchPlans(): Promise<MatchPlan[]> {
    const rawPlans: MatchPlan[] = await prisma.matchPlan.findMany()
    return rawPlans.sort((a, b) => a.id - b.id)
}