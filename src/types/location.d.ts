export interface Coordinates {
	latitude: number;
	longitude: number;
}

interface Location {
	id: number;
	name: string;
	coordinates: Coordinates;
}

export default Location;
