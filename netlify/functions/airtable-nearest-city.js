// netlify/functions/get-nearest-city.js
export async function handler(event, context) {
  try {
    const params = event.queryStringParameters;
    const cities = params.cities ? JSON.parse(params.cities) : [];
    const currentLat = parseFloat(params.lat);
    const currentLng = parseFloat(params.lng);

    const apiKey = process.env.GOOGLE_PLACE_API_KEY;

    // --- Helper: Get coordinates for each city ---
    async function getCityCoordinates(city) {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const loc = data.results[0].geometry.location;
        return { city, lat: loc.lat, lng: loc.lng };
      } else {
        return null;
      }
    }

    // --- Helper: Distance calculation (Haversine) ---
    function getDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }

    // --- Process ---
    const results = await Promise.all(cities.map(getCityCoordinates));
    const validCities = results.filter(Boolean);

    let nearest = null;
    let minDistance = Infinity;

    validCities.forEach(({ city, lat, lng }) => {
      const dist = getDistance(currentLat, currentLng, lat, lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = { city, lat, lng, distance: dist };
      }
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        success: true,
        nearestCity: nearest,
        allCities: validCities
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
}
