const map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            sweden: {
                type: "vector",
                tiles: ["http://localhost:8080/data/sweden/{z}/{x}/{y}.pbf"],
                minzoom: 0,
                maxzoom: 14,
                attribution: '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
            }
        },
        layers: [
            {
                        id: "water",
                        type: "fill",
                        source: "sweden",
                        "source-layer": "water",
                        paint: {
                            "fill-color": "blue",
                            "fill-opacity": 0.5
                        }
                    },
                    {
                        id: "landuse",
                        type: "fill",
                        source: "sweden",
                        "source-layer": "landuse", 
                        paint: {
                            "fill-color": "green",
                            "fill-opacity": 0.4
                        }
                    },
                    {
                        id: "landcover",
                        type: "fill",
                        source: "sweden",
                        "source-layer": "landcover",
                        paint: {
                            "fill-color": "green",
                            "fill-opacity": 0.4
                        }
                    }, 
                    {
                        id: "mountain_peak",
                        type: "fill",
                        source: "sweden",
                        "source-layer": "mountain_peak",
                        paint: {
                            "fill-color": "gray",
                            "fill-opacity": 0.2
                        }
                    },
                    {
                        id: "park",
                        type: "fill",
                        source: "sweden",
                        "source-layer": "park",
                        paint: {
                            "fill-color": "green",
                            "fill-opacity": 0.4
                        }
                    },
                    {
                        id: "aeroway",
                        type: "fill",
                        source: "sweden",
                        "source-layer": "aeroway",
                        paint: {
                            "fill-color": "yellow",
                            "fill-opacity": 0.4
                        }
                    },
                    {
                        id: "roads",
                        type: "line",
                        source: "sweden",
                        "source-layer": "transportation",
                        paint: {
                            "line-color": "black",
                            "line-width": 1,
                        }
                    },
                    {
                        id: "buildings",
                        type: "fill",
                        source: "sweden",
                        "source-layer": "building",
                        paint: {
                            "fill-color": "gray",
                            "fill-opacity": 0.5,
                            "fill-outline-color": "black"
                        }
                    }
        ]
    },
    center: [18.35, 57.55],
    zoom: 9
});