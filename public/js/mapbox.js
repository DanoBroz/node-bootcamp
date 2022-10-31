/* eslint-disable */
console.log('hello from the client side')

const locations = JSON.parse(
    document.getElementById('map').dataset
        .locations
)

console.log(locations)

mapboxgl.accessToken =
    'pk.eyJ1IjoiYnJvZGFuIiwiYSI6ImNsOXI4MnpmZDAzOGkzeW84c3N6Z3kzaWgifQ.Ys7KL1wVQFEWcxDnNQYjNw'
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/brodan/cl9wnxn49001514pltgfonb35',
    scrollZoom: false,
    // center: [-118.113491, 34.111745],
    // zoom: 8,
    // interactive: false,
})

const bounds = new mapboxgl.LngLatBounds()

locations.forEach((loc) => {
    // create marker
    const el = document.createElement('div')
    el.className = 'marker'

    // add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
    })
        .setLngLat(loc.coordinates)
        .addTo(map)

    // add popup
    new mapboxgl.Popup({ offset: 30 })
        .setLngLat(loc.coordinates)
        .setHTML(
            `<p>Day ${loc.day}: ${loc.description}</p>`
        )
        .addTo(map)

    // extend map bounds to include current location
    bounds.extend(loc.coordinates)
})

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
    },
})
