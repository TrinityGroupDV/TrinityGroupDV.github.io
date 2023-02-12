$(document).ready(async function () {
    // TODO: aggiustare legenda, scegliere colori, fare GIF

    const margin = { top: 10, right: 20, bottom: 30, left: 50 },
        width = 1300 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#graph_1B")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    let formattedDate = 0;
    // Mappa e proiezione
    const path = d3.geoPath();
    const projection = d3.geoMercator()
        .scale(110)
        .center([0, 0])
        .translate([width / 1.79, height / 1.6]);

    // Mappa dei dati e color palette
    let data = new Map()
    const colorScale = d3.scaleThreshold()
        .domain([0, 1, 2, 3, 4])
        .range(["grey", "#65b5fd", "#fdfe73", "#ffbf29", "#ff3e6b"])

    // Variabile aux per controllare se è la prima mappa disegnata in assoluto
    let firstDrawMap = 0;
    let tempObj = {};
    let temp_i = 0;
    let dataMap = new Map();
    let dateObj = {};

    date1B(0);

    // Mappa prima data
    function date1B(value) {

        // Carico i dati
        Promise.all([
            d3.json("../world.geojson"),
            d3.csv("../../csv/visione_globale/school-closures-covid_full.csv", function (d) {
                tempObj[temp_i] = d;
                temp_i++;
            })

        ]).then(function (loadData) {
            let topo = loadData[0]

            let dataTemp = 0;

            //Inizializzo prima data in assoluto
            dataTemp = new Date("2020-01-21")

            // Aggiungo tot giorni
            dataTemp.setDate(dataTemp.getDate() + value)

            // Converto in string e formatto
            formattedDate = dataTemp.toISOString().slice(0, 10);

            let temp_a = 0;

            // Estraggo i campi con quella precisa data
            for (i = 0; i < 199147; i++) {
                if (tempObj[i].Day == formattedDate) {
                    dateObj[temp_a] = tempObj[i]
                    temp_a++;
                }
            }

            // Riempo la mappa
            for (i = 0; i < Object.keys(dateObj).length; i++) {
                dataMap.set(dateObj[i].Code, +dateObj[i].school_closures)
            }

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
                        d.total = dataMap.get(d.id) || 0;
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
                        d.total = dataMap.get(d.id) || 0;
                        return colorScale(d.total);
                    })
            }

            // Data a schermo
            svg.select('text.legend1B').remove()
            svg.append("text")
                .attr("class", "legend1B")
                .attr("x", 370).attr("y", 400)
                .text(formattedDate)
                .style("font-size", "20px")
                .attr("alignment-baseline", "middle")
        })
    }

    // Controllo se l'animazione è in corso
    buttonWorld1 = 1;
    function check() {
        buttonWorld1 = 1
    }

    // Lancio l'animazione
    document.getElementById('world1').addEventListener("click", function () {
        if (buttonWorld1 == 1) {
            buttonWorld1 = 0;

            date1B(0);
            for (i = 0; i < 72; i++) {
                setTimeout(date1B, i * 2000, i * 10);
            }
            setTimeout(check, 18000);
        }
        dataMap.clear()
    })

    // Disegno la legenda

    //No data
    svg.append("rect")
        .attr("x", 370)
        .attr("y", 520)
        .attr('width', 80)
        .attr('height', 15)
        .style("fill", "grey")
        .attr('stroke', 'grey')
    svg.append("text")
        .attr("x", 385)
        .attr("y", 510)
        .text("No data")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")

    //Primo blocco
    svg.append("rect")
        .attr("x", 500)
        .attr("y", 520)
        .attr('width', 120)
        .attr('height', 15)
        .style("fill", "#65b5fd")
        .attr('stroke', 'grey')
    svg.append("text")
        .attr("x", 523)
        .attr("y", 510)
        .text("No measures")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")

    //Secondo blocco
    svg.append("rect")
        .attr("x", 620)
        .attr("y", 520)
        .attr('width', 120)
        .attr('height', 15)
        .style("fill", "#fdfe73")
        .attr('stroke', 'grey')
    svg.append("text")
        .attr("x", 638)
        .attr("y", 510)
        .text("Recommended")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")

    //Terzo blocco
    svg.append("rect")
        .attr("x", 740)
        .attr("y", 520)
        .attr('width', 120)
        .attr('height', 15)
        .style("fill", "#ffbf29")
        .attr('stroke', 'grey')
    svg.append("text")
        .attr("x", 738)
        .attr("y", 510)
        .text("Required (some levels)")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")

    //Quarto blocco
    svg.append("rect")
        .attr("x", 860)
        .attr("y", 520)
        .attr('width', 120)
        .attr('height', 15)
        .style("fill", "#ff3e6b")
        .attr('stroke', 'grey')
    svg.append("text")
        .attr("x", 868)
        .attr("y", 510)
        .text("Required (all levels)")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")
});










