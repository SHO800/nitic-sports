import {Team} from "@prisma/client";

type OrganizedTeams = Record<string, Team[]>

export default OrganizedTeams