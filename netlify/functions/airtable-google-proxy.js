export async function handler(event, context) {
    try {
        const lat = event.queryStringParameters.lat;
        const lng = event.queryStringParameters.lng;

        // Example: call Google Places API here
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50000&type=locality&key=${process.env.GOOGLE_PLACE_API_KEY}`);
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // or "http://localhost" for more strict
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
            },
            body: JSON.stringify(data),
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
