// ==UserScript==
// @name         Examensarbete Benchmarking Leaflet.Vectorgrid
// @namespace    http://tampermonkey.net/
// @version      2026-04-24-leaflet-fixed
// @description  Benchmarking for Leaflet only
// @match        http://localhost:3000/leaflet*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const RESULTS = [];
    const REPS = 100;
    const PAUSE_MS = 800;
    const TIMEOUT_MS = 10000;

    const AREAS = {
        low: { center: [59.10, 17.50], zoom: 12 },
        high: { center: [59.3293, 18.0686], zoom: 12 }
    };

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function heapMB() {
        return performance.memory
            ? (performance.memory.usedJSHeapSize / 1048576).toFixed(2)
            : "";
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function getMap() {
        return window.benchmarkMap || null;
    }

    function downloadCSV(rows) {
        const csv = rows.map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "leaflet-benchmark.csv";
        a.click();
    }


    // Detects map
    function waitForMap() {

        const interval = setInterval(() => {

            const map = window.benchmarkMap;

            if (map && map._container && typeof map.setView === "function") {

                clearInterval(interval);

                setTimeout(runAll, 1000);
            }

        }, 500);
    }

    // Interaction to visual stability timing
    function waitLeafletIVST(map, stableMs = 200) {
        return new Promise(resolve => {

            let lastChange = performance.now();
            let stableFrames = 0;

            function isBusy() {
                let loading = 0;

                map.eachLayer(layer => {
                    if (layer._loading) loading++;
                });

                return (
                    loading > 0 ||
                    map._animatingZoom ||
                    map._zooming ||
                    map._moving
                );
            }

            function frame() {
                const now = performance.now();

                if (isBusy()) {
                    lastChange = now;
                    stableFrames = 0;
                } else {
                    stableFrames++;
                }

                const stableTime = now - lastChange;

                if (stableFrames >= 3 && stableTime >= stableMs) {
                    resolve();
                    return;
                }

                requestAnimationFrame(frame);
            }

            requestAnimationFrame(frame);
        });
    }

    async function runLeaflet(map, area, action) {

        let start;

        if (action === "load") {
            map.setView([58,16], 8);
            await waitLeafletIVST(map);

            start = performance.now();

            map.setView(area.center, area.zoom);
            await waitLeafletIVST(map);
        }

        if (action === "zoom") {
            const z = map.getZoom();

            start = performance.now();

            map.setZoom(z + 1);
            await waitLeafletIVST(map);

            map.setZoom(z);
            await waitLeafletIVST(map);
        }

        const end = performance.now();

        return {
            ivst_ms: (end - start).toFixed(2)
        };
    }

    async function runScenario(run_id, rep, complexity, action) {

        const map = getMap();
        if (!map) return;

        const area = AREAS[complexity];

        const result = await runLeaflet(map, area, action);

        RESULTS.push([
            run_id,
            "leaflet",
            rep,
            complexity,
            action,
            result.ivst_ms,
            heapMB(),
            Date.now()
        ]);
    }

    async function warmup() {
        const map = getMap();
        if (!map) return;

        await runLeaflet(map, AREAS.low, "load");
        await runLeaflet(map, AREAS.high, "load");

        await sleep(1500);
    }

    async function runAll() {

        console.log("Leaflet benchmark started");

        const scenarios = [
            { complexity: "low", action: "load" },
            { complexity: "high", action: "load" },
            { complexity: "low", action: "zoom" },
            { complexity: "high", action: "zoom" }
        ];

        let run_id = 1;

        await warmup();

        for (let rep = 1; rep <= REPS; rep++) {

            const randomized = shuffle([...scenarios]);

            for (const s of randomized) {
                await runScenario(run_id++, rep, s.complexity, s.action);
                await sleep(PAUSE_MS);
            }
        }

        RESULTS.unshift([
            "run_id",
            "library",
            "rep",
            "complexity",
            "action",
            "ivst_ms",
            "heap_mb",
            "timestamp"
        ]);

        downloadCSV(RESULTS);

        console.log("Leaflet benchmark complete");
    }

    waitForMap();

})();