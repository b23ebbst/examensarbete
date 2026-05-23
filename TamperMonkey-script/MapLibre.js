// ==UserScript==
// @name         Examensarbete Benchmarking MapLibre GL JS
// @namespace    http://tampermonkey.net/
// @version      2026-04-25-maplibre-ivst
// @description  Benchmarking for MapLibre
// @match        http://localhost:3000/maplibre*
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
        low: {
            center: [59.10, 17.50], // [lat, lng]
            zoom: 12
        },
        high: {
            center: [59.3293, 18.0686], // [lat, lng]
            zoom: 12
        }
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
        return window.benchmarkMap;
    }

    function downloadCSV(rows) {
        const csv = rows.map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "maplibre-benchmark.csv";
        a.click();
    }

    // Interaction to visual stability
    function waitMapLibreIVST(map) {
        return new Promise(resolve => {
            const done = () => resolve();

            map.once("idle", done);
        });
    }

    async function runMapLibre(map, area, action) {

        let start;

        // move to unrelated area first, then benchmark move to target
        if (action === "load") {

            await new Promise(r => requestAnimationFrame(r));
            map.jumpTo({
                center: [16, 58], 
                zoom: 8
            });

            await waitMapLibreIVST(map);

            start = performance.now();

            await new Promise(r => requestAnimationFrame(r));
            map.jumpTo({
                center: [area.center[1], area.center[0]], 
                zoom: area.zoom
            });

            await waitMapLibreIVST(map);
        }

        if (action === "zoom") {

            const z = map.getZoom();

            start = performance.now();

            await new Promise(r => requestAnimationFrame(r));
            map.jumpTo({
                zoom: z + 1
            });

            await waitMapLibreIVST(map);

            await new Promise(r => requestAnimationFrame(r));
            map.jumpTo({
                zoom: z
            });

            await waitMapLibreIVST(map);
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
        const result = await runMapLibre(map, area, action);

        RESULTS.push([
            run_id,
            "maplibre",
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

        await runMapLibre(map, AREAS.low, "load");
        await runMapLibre(map, AREAS.high, "load");

        await sleep(1500);
    }

    async function runAll() {

        console.log("MapLibre benchmark started");

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

        console.log("MapLibre benchmark complete");
    }


    // Detetcs map
    function waitForMap() {

        const interval = setInterval(() => {

            const map = window.benchmarkMap || null;

            const isMapLibre =
                map &&
                typeof map.jumpTo === "function" &&
                typeof map.getCanvas === "function";

            if (isMapLibre) {

                console.log("[MapLibre Benchmark] Map detected");

                window.benchmarkMap = map;

                clearInterval(interval);

                setTimeout(runAll, 1000);
            }

        }, 100);
    }

    waitForMap();

})();