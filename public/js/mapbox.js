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
    style: 'mapbox://styles/mapbox/streets-v11',
})
