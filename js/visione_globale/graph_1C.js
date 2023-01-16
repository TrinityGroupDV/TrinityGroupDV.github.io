$(document).ready(async function () {

    const margin = { top: 10, right: 20, bottom: 30, left: 50 },
        width = 640 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom;

    const svg = d3.select("#graph_1C")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // Mappa e proiezione
    const path = d3.geoPath();
    const projection = d3.geoMercator()
        .scale(90)
        .center([0, 20])
        .translate([width / 1.79, height / 1.6]);

    // Mappa dei dati e color palette
    let data = new Map()
    const colorScale = d3.scaleThreshold()
        .domain([0, 1, 2, 3, 4])
        .range(["grey", "#2282FF", "#FAFF22", "#FFA922", "#FF3B22"])

    // Variabile aux per controllare se è la prima mappa disegnata in assoluto
    let firstDrawMap = 0;
    date1();

    // Mappa prima data
    function date1() {

        // Carico i dati
        Promise.all([
            d3.json("../world.geojson"),
            d3.csv("../../csv/visione_globale/graph_1C.csv", function (d) {
                data.set(d.code, +d.date1)
            })
        ]).then(function (loadData) {
            let topo = loadData[0]

            //If è la prima mappa disegnata in assoluto
            if (firstDrawMap == 0) {
                // Disegno la mappa
                svg.append("g")
                    .selectAll("path")
                    .data(topo.features)
                    .join("path")
                    // Disegno ogni paese
                    .attr("d", d3.geoPath()
                        .projection(projection)
                    )
                    // Coloro ogni paese
                    .attr("fill", function (d) {
                        d.total = data.get(d.id) || 0;
                        return colorScale(d.total);
                    })
                    .style("stroke", "black")
                    .attr("stroke-opacity", 0.4)
                firstDrawMap = 1;
            }
            //If non lo è
            else {
                svg.selectAll("path")
                    .data(topo.features)
                    .join("path")
                    .attr("fill", function (d) {
                        d.total = data.get(d.id) || 0;
                        return colorScale(d.total);
                    })
            }

            // Stampo la data
            svg.append("rect")
                .attr("x", 520)
                .attr("y", 0)
                .attr('width', 120)
                .attr('height', 20)
                .style("fill", "white")
            svg.append("text")
                .attr("x", 525).attr("y", 10)
                .text("20/02/2020")
                .style("font-size", "20px")
                .attr("alignment-baseline", "middle")
        })
    }

    // Mappa seconda data
    function date2() {

        Promise.all([
            d3.json("../world.geojson"),
            d3.csv("../../csv/visione_globale/graph_1C.csv", function (d) {
                data.set(d.code, +d.date2)
            })
        ]).then(function (loadData) {
            let topo = loadData[0]

            svg.selectAll("path")
                .data(topo.features)
                .join("path")
                .attr("fill", function (d) {
                    d.total = data.get(d.id) || 0;
                    return colorScale(d.total);
                })
        })

        svg.append("rect")
            .attr("x", 520)
            .attr("y", 0)
            .attr('width', 120)
            .attr('height', 20)
            .style("fill", "white")
        svg.append("text")
            .attr("x", 525).attr("y", 10)
            .text("25/02/2020")
            .style("font-size", "20px")
            .attr("alignment-baseline", "middle")
    }

    // Mappa terza data
    function date3() {

        Promise.all([
            d3.json("../world.geojson"),
            d3.csv("../../csv/visione_globale/graph_1C.csv", function (d) {
                data.set(d.code, +d.date3)
            })
        ]).then(function (loadData) {
            let topo = loadData[0]

            svg.selectAll("path")
                .data(topo.features)
                .join("path")
                .attr("fill", function (d) {
                    d.total = data.get(d.id) || 0;
                    return colorScale(d.total);
                })
        })

        svg.append("rect")
            .attr("x", 520)
            .attr("y", 0)
            .attr('width', 120)
            .attr('height', 20)
            .style("fill", "white")
        svg.append("text")
            .attr("x", 525).attr("y", 10)
            .text("03/03/2020")
            .style("font-size", "20px")
            .attr("alignment-baseline", "middle")
    }

    // Mappa quarta data
    function date4() {

        Promise.all([
            d3.json("../world.geojson"),
            d3.csv("../../csv/visione_globale/graph_1C.csv", function (d) {
                data.set(d.code, +d.date4)
            })
        ]).then(function (loadData) {
            let topo = loadData[0]

            svg.selectAll("path")
                .data(topo.features)
                .join("path")
                .attr("fill", function (d) {
                    d.total = data.get(d.id) || 0;
                    return colorScale(d.total);
                })
        })

        svg.append("rect")
            .attr("x", 520)
            .attr("y", 0)
            .attr('width', 120)
            .attr('height', 20)
            .style("fill", "white")
        svg.append("text")
            .attr("x", 525).attr("y", 10)
            .text("10/03/2020")
            .style("font-size", "20px")
            .attr("alignment-baseline", "middle")
    }

    // Controllo se l'animazione è in corso
    buttonWorld2 = 1;
    function check() {
        buttonWorld2 = 1
    }

    // MODIFICA - PROVARE AD AGGIUNGERE CHE QUANDO SI CLICCA L'ANIMAZIONE SI RESETTA
    // Lancio l'animazione
    document.getElementById('world2').addEventListener("click", function () {
        if (buttonWorld2 == 1) {
            buttonWorld2 = 0;
            date1();
            setTimeout(date2, 2000)
            setTimeout(date3, 4000)
            setTimeout(date4, 6000)
            setTimeout(check, 6000);
        }
    })

    // Disegno la legenda

    //No data
    svg.append("rect")
        .attr("x", 30)
        .attr("y", 443)
        .attr('width', 80)
        .attr('height', 15)
        .style("fill", "grey")
        .attr('stroke', 'grey')
    svg.append("text")
        .attr("x", 50)
        .attr("y", 435)
        .text("No data")
        .style("font-size", "10.5px")
        .attr("alignment-baseline", "middle")

    //Primo blocco
    svg.append("rect")
        .attr("x", 140)
        .attr("y", 443)
        .attr('width', 120)
        .attr('height', 15)
        .style("fill", "#2282FF")
        .attr('stroke', 'grey')
    svg.append("text")
        .attr("x", 170)
        .attr("y", 435)
        .text("No measures")
        .style("font-size", "10.5px")
        .attr("alignment-baseline", "middle")

    //Secondo blocco
    svg.append("rect")
        .attr("x", 260)
        .attr("y", 443)
        .attr('width', 120)
        .attr('height', 15)
        .style("fill", "#FAFF22")
        .attr('stroke', 'grey')
    svg.append("text")
        .attr("x", 285)
        .attr("y", 435)
        .text("Recommended")
        .style("font-size", "10.5px")
        .attr("alignment-baseline", "middle")

    //Terzo blocco
    svg.append("rect")
        .attr("x", 380)
        .attr("y", 443)
        .attr('width', 120)
        .attr('height', 15)
        .style("fill", "#FFA922")
        .attr('stroke', 'grey')
    svg.append("text")
        .attr("x", 380)
        .attr("y", 435)
        .text("Required (some levels)")
        .style("font-size", "10.5px")
        .attr("alignment-baseline", "middle")

    //Quarto blocco
    svg.append("rect")
        .attr("x", 490)
        .attr("y", 443)
        .attr('width', 120)
        .attr('height', 15)
        .style("fill", "#FF3B22")
        .attr('stroke', 'grey')
    svg.append("text")
        .attr("x", 503)
        .attr("y", 435)
        .text("Required (all levels)")
        .style("font-size", "10.5px")
        .attr("alignment-baseline", "middle")
});










