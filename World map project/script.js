mapboxgl.accessToken = 'pk.eyJ1Ijoiam9uYWgtc2luZ2VyIiwiYSI6ImNtNnRrNnMxYzAzc3IycXB3c2V2MGl5dG8ifQ.Zz58VCp7wU1GFjQH1LDLRw';

// Initialize the map
const map = new mapboxgl.Map({
    container: 'map', // The ID of the HTML element to render the map in
    style: 'mapbox://styles/mapbox/light-v10', // Map style
    center: [0, 20], // Center the map on the world (longitude, latitude)
    zoom: 1.5 // Initial zoom level
});

// Add country boundaries
map.on('load', function () {
    map.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1' // Built-in Mapbox country boundaries data
    });

    map.addLayer({
        id: 'country-boundaries',
        type: 'fill',
        source: 'countries',
        'source-layer': 'country_boundaries',
        paint: {
            'fill-color': '#627BC1', // Country fill color
            'fill-opacity': 0.3 // Transparency of the fill
        }
    });

    // Click event to show country info and redirect
    map.on('click', function (e) {
        const features = map.queryRenderedFeatures(e.point, { layers: ['country-boundaries'] });

        if (features.length > 0) {
            const countryName = features[0].properties.name_en; // Get country name
            window.location.href = `countries/country.html?name=${encodeURIComponent(countryName)}`; // Redirect to dynamic country page
        }
    });
});

// Function to search for a country
function searchCountry() {
    let searchInput = document.getElementById("countrySearch").value.toLowerCase(); // Get the search input

    // Fetch data for all countries
    fetch("https://restcountries.com/v3.1/all")
        .then(response => response.json())
        .then(data => {
            let country = data.find(c => c.name.common.toLowerCase() === searchInput); // Find the searched country
            if (country) {
                // Zoom to the country location
                map.flyTo({
                    center: [country.latlng[1], country.latlng[0]], // Longitude, Latitude
                    zoom: 4 // Zoom level
                });

                // Redirect to the country page after 2 seconds
                setTimeout(() => {
                    window.location.href = `countries/country.html?name=${encodeURIComponent(country.name.common)}`;
                }, 2000);
            } else {
                alert("Country not found.");
            }
        });
}
