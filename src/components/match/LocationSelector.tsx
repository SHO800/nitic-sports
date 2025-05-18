import type { Location } from "@prisma/client";

interface LocationSelectorProps {
	locations: Location[] | undefined;
	isShowSelector: boolean;
	setIsShowSelector: (value: boolean) => void;
	setSelectedLocation: (value: string[]) => void;
}

const LocationSelector = ({
	locations,
	isShowSelector,
	setIsShowSelector,
	setSelectedLocation,
}: LocationSelectorProps) => (
	<div
		className={
			"absolute left-0 top-0 transition-transform w-48 h-full bg-white z-10"
		}
		style={{
			transform: isShowSelector ? "translateX(0)" : "translateX(-100%)",
		}}
	>
		<select
			className={"w-full h-full"}
			multiple
			size={10}
			onChange={(event) => {
				setSelectedLocation(
					Array.from((event.target as HTMLSelectElement).selectedOptions).map(
						(option) => option.value,
					),
				);
			}}
		>
			{locations?.map((location) => {
				return (
					<option value={location.id} key={`loc-selector-id-${location.id}`}>
						{location.name}
					</option>
				);
			})}
		</select>
		<div
			className={
				"absolute top-0 left-full h-28 w-6 border-r-4 border-t-4 border-b-4 rounded-r-md border-gray-500 bg-white"
			}
			onClick={() => setIsShowSelector(!isShowSelector)}
		>
			場所選択
		</div>
	</div>
);

export default LocationSelector;
