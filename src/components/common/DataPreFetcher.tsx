import { prisma } from "@/../lib/prisma";
import type OrganizedTeams from "@/types/organizedTeams";
import groupTeams from "@/utils/groupTeams";
import type { MatchResult } from "@prisma/client";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";

// サーバーサイドでPrismaを使用してデータを直接取得
async function getTeams(): Promise<OrganizedTeams> {
	try {
		// ビルド時にはダミーデータを返す（process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build'）
		if (
			process.env.NODE_ENV === "development" ||
			process.env.IS_PREVIEW === "true" || 
			(process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build')
		) {
			const teams = await prisma.team.findMany();
			return groupTeams(teams);
		}
		// APIエンドポイント経由でデータを取得
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/team`, {
			cache: "force-cache",
			next: {
				tags: ["teams"],
				revalidate: 60000
			},
		});
		if (!res.ok) {
			throw new Error("Failed to fetch data");
		}
		const teams = await res.json();
		return groupTeams(teams);
	} catch (error) {
		console.error("Error fetching teams:", error);
		return {}; // 空のオブジェクトを返す
	}
}

async function getLocations() {
	try {
		if (
			process.env.NODE_ENV === "development" ||
			process.env.IS_PREVIEW === "true" ||
			(process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build')
		) {
			return await prisma.location.findMany();
		}
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/location`, {
			cache: "force-cache",
			next: {
				tags: ["locations"],
				revalidate: 60000
			},
		});
		if (!res.ok) {
			throw new Error("Failed to fetch data");
		}
		return await res.json();
	} catch (error) {
		console.error("Error fetching locations:", error);
		return [];
	}
}

async function getMatchPlans() {
	try {
		if (
			process.env.NODE_ENV === "development" ||
			process.env.IS_PREVIEW === "true" ||
			(process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build')
		) {
			return await prisma.matchPlan.findMany();
		}
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/match-plan`, {
			cache: "default",
			next: {
				tags: ["matchPlans"],
				revalidate: 15
			},
		});
		if (!res.ok) {
			throw new Error("Failed to fetch data");
		}
		return await res.json();
	} catch (error) {
		console.error("Error fetching match plans:", error);
		return [];
	}
}

async function getMatchResults() {
	try {
		if (
			process.env.NODE_ENV === "development" ||
			process.env.IS_PREVIEW === "true" ||
			(process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build')
		) {
			const results = await prisma.matchResult.findMany();
			// matchResultsをidをキーとしたオブジェクトに変換
			return results.reduce(
				(acc: Record<string, MatchResult>, result: MatchResult) => {
					acc[result.matchId] = result;
					return acc;
				},
				{},
			);
		}
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/match-result`, {
			cache: "default",
			next: {
				tags: ["matchResults"],
				revalidate: 15
			},
		});
		if (!res.ok) {
			throw new Error("Failed to fetch data");
		}
		return await res.json();
	} catch (error) {
		console.error("Error fetching match results:", error);
		return {};
	}
}

const DataPreFetcher = async ({ children }: { children: ReactNode }) => {
	try {
		// すべてのデータ取得を並行実行してパフォーマンスを向上
		const [teams, locations, matchPlans, matchResults] = await Promise.all([
			getTeams(),
			getLocations(),
			getMatchPlans(),
			getMatchResults(),
		]);

		// fallbackデータとしてSWRConfigに渡す
		return (
			<SWRConfig
				value={{
					fallback: {
						[`${process.env.NEXT_PUBLIC_API_URL}/team`]: teams,
						[`${process.env.NEXT_PUBLIC_API_URL}/location`]: locations,
						[`${process.env.NEXT_PUBLIC_API_URL}/match-plan`]: matchPlans,
						[`${process.env.NEXT_PUBLIC_API_URL}/match-result`]: matchResults,
					},
				}}
			>
				{children}
			</SWRConfig>
		);
	} catch (error) {
		console.error("Error in DataPreFetcher:", error);
		// エラーが発生しても子コンポーネントはレンダリングする
		return <>{children}</>;
	}
};

export default DataPreFetcher;
