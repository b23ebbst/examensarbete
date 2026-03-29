// Karta som centreras på Sverige
        const map = L.map('map', {
            center: [57.55, 18.35], // Startposition [lat, lang]
            zoom: 9,
            renderer: L.canvas(), // Tvinga till canvas-rendering
            minZoom: 0, // Minsta möjliga zoom, värdet hämtat från JSON-fil
            maxZoom: 14 // Maximala zoom som är möjlig, värdet hämtat från JSON-fil
        })

        const vectorLayer = L.vectorGrid.protobuf(
            "http://localhost:8080/data/sweden/{z}/{x}/{y}.pbf",
            {
                vectorTileLayerStyles: {
                    water: { fill: true, fillColor: "blue", fillOpacity: 0.5 },
                    waterway: { fill: true, fillColor: "blue", fillOpacity: 0.3 },
                    landuse: { fill: true, fillColor: "green", fillOpacity: 0.4 },
                    landcover: { fill: true, fillColor: "green", fillOpacity: 0.4 },
                    mountain_peak: { fill: true, fillColor: "gray", fillOpacity: 0.2 },
                    //park: { fill: true, fillColor: "green", fillOpacity: 0.4 },//Skapar gröna cirklar på kartan, fyller alltså inte i parkmark med grönt
                    boundary: { fill: true, fillColor: "black", fillOpacity: 0.6 },
                    aeroway: { fill: true, fillColor: "yellow", fillOpacity: 0.4 },
                    transportation: { fill: true, fillColor: "blue", fillOpacity: 0.7 },
                    building: { fill: true, fillColor: "gray", fillOpacity: 0.6 }, 
                    water_name: { fill: true, fillColor: "black", fillOpacity: 0.3 },
                    transportation_name: { fill: true, fillColor: "black", fillOpacity: 0.3 },
                    //place: { fill: true, fillColor: "orange", fillOpacity: 0.5 }, // Skapar orangea cirklar på kartan
                    //housenumber: { fill: true, fillColor: "black", fillOpacity: 0.3 },
                    //poi: { fill: true, fillColor: "brown", fillOpacity: 0.5}, //Skapar bruna cirklar på kartan
                    aerodrome_label: { fill: true, fillColor: "black", fillOpacity: 0.3 }
                },
                attribution: '&copy; <a href="https://openmaptiles.org/">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>'
            }
        );

        vectorLayer.addTo(map);