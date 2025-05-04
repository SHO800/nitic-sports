import MapContainer from "../map/MapContainer";
import MapPin from "./MapPin";

type Props = {
    locationId: number | null;
}

const MapZoom = ({locationId}: Props) => {
    
    const mapIdJudge = (placeId: number | null) =>{
        if(placeId === 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9 || 16) return 1;
        if(placeId === 10 || 11 || 12 || 13 || 14 || 15) return 2;
        else return 0;
    }
    
    const MapId = mapIdJudge(locationId);

    const locationJudge = (placeId: number | null) => {
        if(placeId === 1 || 2 || 3 || 4 || 5) return "第1体育館"
        if(placeId === 6 || 7 ) return "第2体育館"
        if(placeId === 8 || 9 || 16) return "陸上グラウンド"
        if(placeId === 10 || 11) return "テニスコートAB"
        if(placeId === 12 || 13) return "テニスコートCD"
        if(placeId === 14 || 15) return "野球グラウンド"

    }

    return (
        <>
            {MapId === 1 && (
                <div>
                    <p className="mt-2 ml-4">会場: {locationJudge(locationId)}</p>
                    <div className="relative">
                        <MapContainer tag={0} />
                        <MapPin location={locationJudge(locationId)}/>
                    </div>
                </div>
            )}
            {MapId === 2 && (
                <div>
                    <p className="mt-2 ml-4">試合会場</p>
                    <MapContainer tag={1} />
                </div>
            )}
            {MapId === 0 && (
                <div>
                    制作者の怠慢によりマップがないようです
                </div>
            )}
        </>
    )
}

export default MapZoom;