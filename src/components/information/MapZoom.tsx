import MapContainer from "../map/MapContainer";
import MapPin from "./MapPin";

type Props = {
	locationId: number | null;
};

const MapZoom = ({ locationId }: Props) => {
	const mapIdJudge = (placeId: number | null) => {
		if (placeId === null || placeId > 17) return 0;
		if (1 <= placeId && placeId <= 10 || placeId === 17) return 1;
		if (11 <= placeId && placeId <= 16) return 2;
	};

	const MapId = mapIdJudge(locationId);

	const locationJudge = (placeId: number | null) => {
		if (placeId === null || placeId > 17) return "地球";
		if (placeId === 1) return "第1体育館 Aコート";
		if (placeId === 2) return "第1体育館 Bコート";
		if (placeId === 3) return "第1体育館 Cコート";
		if (placeId === 4) return "第1体育館 Dコート";
		if (placeId === 5) return "第1体育館 Eコート";
		if (placeId === 6) return "第2体育館 Aコート";
		if (placeId === 7) return "第2体育館 Bコート";
		if (placeId === 8) return "第2体育館";
		if (placeId === 9) return "陸上グラウンド Aコート";
		if (placeId === 10) return "陸上グラウンド Bコート";
		if (placeId === 11) return "野球グラウンド A";
		if (placeId === 12) return "野球グラウンド B";
		if (placeId === 13) return "テニスコートA";
		if (placeId === 14) return "テニスコートB";
		if (placeId === 15) return "テニスコートC";
		if (placeId === 16) return "テニスコートD";
		if (placeId === 17) return "陸上グラウンド";
		
	};

	return (
		<>
			{MapId === 1 && (
				<div>
					<p className="mt-2 ml-4 font-bold">
						会場: {locationJudge(locationId)}
					</p>
					<div className="relative">
						<MapContainer tag={0} />
						<MapPin location={locationJudge(locationId)} />
					</div>
				</div>
			)}
			{MapId === 2 && (
				<div>
					<p className="mt-2 ml-4">会場: {locationJudge(locationId)}</p>
					<div className="relative">
						<MapContainer tag={1} />
						<MapPin location={locationJudge(locationId)} />
					</div>
				</div>
			)}
			{/*{MapId === 0 && <div>制作者の怠慢によりマップがないようです</div>}*/}
		</>
	);
};

export default MapZoom;
