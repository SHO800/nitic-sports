import Image from "next/image";

type Props = {
	tag: number;
};

const MapContainer = ({ tag }: Props) => {
	return (
		<div className="w-[380px] h-[400px] gap-4 p-4 overflow-auto">
			<Image
				src={`/map/${tag}.png`}
				alt={`map ${tag}`}
				width={380}
				height={400}
				className="object-contain"
			/>
		</div>
	);
};

export default MapContainer;
