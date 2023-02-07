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
    const colorScale = d3.scaleThreshold()
        .domain([0, 1, 2, 3])
        .range(["grey", "#2282FF", "#FFA922", "#FF3B22"])

    // Variabile aux per controllare se è la prima mappa disegnata in assoluto
    let firstDrawMap = 0;



    let temp_i = 0
    let tempObj1 = {}
    let dataMap = new Map();

    date1C(0)

    // Mappa prima data
    function date1C(value, bool) {

        // Carico i dati
        Promise.all([
            d3.json("../world.geojson"),
            d3.csv("../../csv/visione_globale/public-events-covid_full.csv", function (d) {
                tempObj1[temp_i] = d;
                temp_i++;
            })

        ]).then(function (loadData) {
            let topo = loadData[0]

            let dataTemp = 0;

            // console.log(tempObj1)

            //Inizializzo prima data in assoluto
            dataTemp = new Date("2020-01-21")

            // Aggiungo tot giorni
            dataTemp.setDate(dataTemp.getDate() + value)

            // Converto in string e formatto
            let formattedDate1 = dataTemp.toISOString().slice(0, 10);

            let dateObj = {};
            let temp_a = 0;

            // Estraggo i campi con quella precisa data
            for (i = 0; i < 199147; i++) {
                if (tempObj1[i].Day == formattedDate1) {
                    dateObj[temp_a] = tempObj1[i]
                    temp_a++;
                }
            }

            // Riempo la mappa

            for (i = 0; i < Object.keys(dateObj).length; i++) {
                dataMap.set(dateObj[i].Code, +dateObj[i].cancel_public_events)
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
            d3.select('text.legend1C').remove()
            svg.append("text")
                .attr("class", "legend1C")
                .attr("x", 500).attr("y", 10)
                .text(formattedDate1)
                .style("font-size", "20px")
                .attr("alignment-baseline", "middle")


            dateObj = {};
            dataMap.clear()

            if (bool == true) {

                tempObj1 = {}
                //let tempObj1 = {}
                console.log(tempObj1)
                console.log(dataMap)
                console.log(dateObj)

            }


        })
    }

    // Controllo se l'animazione è in corso
    // Controllo se l'animazione è in corso
    buttonWorld2 = 1;
    function check() {
        buttonWorld2 = 1
    }

    // Lancio l'animazione
    document.getElementById('world2').addEventListener("click", function () {
        if (buttonWorld2 == 1) {
            buttonWorld2 = 0;

            date1C(0);
            for (i = 0; i < 35; i++) {
                setTimeout(date1C, i * 500, i * 10, false);
            }
            setTimeout(date1C, 18000, 360, true);
            setTimeout(check, 18000);
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










