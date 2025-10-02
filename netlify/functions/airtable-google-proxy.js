import fetch from "node-fetch";

export async function handler(event) {
  const { lat, lng } = event.queryStringParameters;

  if (!lat || !lng) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing lat or lng" }),
    };
  }

  const GOOGLE_PLACE_API_KEY = process.env.GOOGLE_PLACE_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=100000&type=locality&key=${GOOGLE_PLACE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // allow frontend requests
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
