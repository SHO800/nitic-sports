import { Fragment, memo } from "react";

const MatchTeams = memo(function MatchTeams({
	teamNames,
}: { teamNames: string[] }) {
	return (
		<p
			className={
				"text-[1.2em] py-1 flex flex-row justify-center space-x-8 mb-2 border-b-2 border-gray-500 "
			}
		>
			{teamNames.map((teamName, index) => {
				return (
					<Fragment
						key={"battleTeams-" + teamNames.join("-") + "-" + teamName + index}
					>
						{index !== 0 && (
							<span className={"text-[.9em] mt-auto mb-1"}>vs</span>
						)}
						<span>{teamName}</span>
					</Fragment>
				);
			})}
		</p>
	);
});

export default MatchTeams;
