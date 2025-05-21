"use client";

import SignIn from "@/components/auth/sign-in";
import SignOut from "@/components/auth/sign-out";
import Events from "@/components/dashboard/Events";
import Location from "@/components/dashboard/Location";
import MatchPlan from "@/components/dashboard/MatchPlan";
import Teams from "@/components/dashboard/Teams";
import TotalScore from "@/components/dashboard/TotalScore";

const Dashboard = () => {
	return (
		<div>
			<div className="min-h-screen">

				{/*<details className="container mx-auto p-4">*/}
				{/*	<summary className="text-3xl font-bold mb-4 px-3 py-2 rounded-2xl bg-blue-900  text-white">*/}
				{/*		クラス*/}
				{/*	</summary>*/}
				{/*	<Teams />*/}
				{/*</details>*/}

				<details className="container mx-auto p-4" >
					<summary className="text-3xl font-bold mb-4 px-3 py-2 rounded-2xl bg-blue-900  text-white">
						種目毎対戦表
					</summary>
					<Events />
				</details>

				<details className="container mx-auto p-4">
					<summary className="text-3xl font-bold mb-4 px-3 py-2 rounded-2xl bg-blue-900  text-white">
						試合
					</summary>
					<MatchPlan />
				</details>
				<details className="container mx-auto p-4">
					<summary className="text-3xl font-bold mb-4 px-3 py-2 rounded-2xl bg-blue-900  text-white">
						全体スコア
					</summary>
					<TotalScore />
				</details>
				{/*<details className="container mx-auto p-4">*/}
				{/*	<summary className="text-3xl font-bold mb-4 px-3 py-2 rounded-2xl bg-blue-900  text-white">*/}
				{/*		会場*/}
				{/*	</summary>*/}
				{/*	<Location />*/}
				{/*</details>*/}
			</div>
		</div>
	);
};

export default Dashboard;
