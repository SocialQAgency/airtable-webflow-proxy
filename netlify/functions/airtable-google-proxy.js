export async function handler(event, context) {
    try {
        const lat = event.queryStringParameters.lat;
        const lng = event.queryStringParameters.lng;

        // Use Places Text Search API with query=city
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=city&location=${lat},${lng}&radius=50000&key=${process.env.GOOGLE_PLACE_API_KEY}`
        );

        const data = await response.json();

        // Extract only useful info (like city names & coordinates)
        const cities = data.results.map(place => ({
            name: place.name,
            address: place.formatted_address,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
        }));

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // allow all origins (or restrict to localhost)
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
            },
            body: JSON.stringify(cities),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ error: error.message }),
        };
    }
}
