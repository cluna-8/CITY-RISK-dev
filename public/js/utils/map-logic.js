/* City Risk - Mapbox Integration & Visual Styles */
const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2x1bmFjYmEiLCJhIjoiY21qYTMzcDFrMDFjODNkcnptNjU2eWIzcSJ9.IVrWapAdW7kmbzctZEW6rg';
mapboxgl.accessToken = MAPBOX_TOKEN;

let map;
let currentMarker;

function initCityRiskMap(containerId, center = [-58.3816, -34.6037], zoom = 10) {
    // Estilo "Navigation Day" - Ofrece un balance perfecto entre elegancia y contraste
    // Las líneas de distritos y calles son mucho más visibles que en el estilo Light standard.
    map = new mapboxgl.Map({
        container: containerId,
        style: 'mapbox://styles/mapbox/navigation-day-v1',
        center: center,
        zoom: zoom,
        pitch: 45,
        bearing: 0,
        antialias: true
    });

    map.on('load', () => {
        // Terreno 3D (DEM)
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        // Mejorar visibilidad de edificios 3D con un sombreado más técnico
        map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#cbd5e1', // Gris pizarra claro pero sólido
                'fill-extrusion-height': ['get', 'height'],
                'fill-extrusion-base': ['get', 'min_height'],
                'fill-extrusion-opacity': 0.9
            }
        });

        // Oscurecer sutilmente las líneas administrativas para Argentina
        if (map.getLayer('admin-1-boundary-bg')) {
            map.setPaintProperty('admin-1-boundary-bg', 'line-color', '#1e293b');
            map.setPaintProperty('admin-1-boundary-bg', 'line-width', 2);
        }
    });

    return map;
}

// Función para volar a un municipio y poner un marcador
function flyToLocation(lng, lat, name) {
    if (!map) return;

    map.flyTo({
        center: [lng, lat],
        zoom: 13,
        essential: true,
        pitch: 60,
        speed: 1.2
    });

    if (currentMarker) currentMarker.remove();

    // Marcador institucional elegante
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.fontSize = '2.5rem';
    el.style.filter = 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))';
    el.innerHTML = '📍';

    currentMarker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 10px; font-family: 'Outfit', sans-serif;">
                <h4 style="margin: 0; color: #0056B3;">${name}</h4>
                <p style="margin: 5px 0 0; font-size: 0.8rem; color: #64748b;">Jurisdicción Verificada por City Risk</p>
            </div>
        `))
        .addTo(map);
}
