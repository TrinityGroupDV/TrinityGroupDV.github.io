$(document).ready(function () {

    let aux = 0;
    draw()
    addEventListener("resize", (event) => {
        draw()
    })

    function draw() {

        let clientHeight = document.getElementById('graph_2E').clientHeight - 55;
        let clientWidth = document.getElementById('graph_2E').clientWidth - 120;

        const margin = { top: 10, right: 30, bottom: 50, left: 80 };

        if (aux == 1) {
            $("#graph_2E").empty();
        }
        aux = 1;

        const svg = d3.select("#graph_2E")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        //Inizializzo mappe e array dove inserirò i dati
        let arrayDeath = [];
        let arrayVaccines = [];
        let arrayCases = [];
        let mapDeath = new Map();
        let mapVaccines = new Map();
        let mapCases = new Map();

        // Leggo i dati
        d3.csv("../../csv/sanità/graph_2E.csv",

            // Formatto le date
            function (d) {
                return { date: d3.timeParse("%Y-%m-%d")(d.date), death: d.death, vaccines: d.vaccines, case: d.cases }
            }).then(

                function (data) {
                    // Inserisco i dati entro agli array
                    for (let i = 0; i < data.length; i++) {
                        arrayDeath.push({ "date": data[i].date, "n": data[i].death }) //ROSSO
                        arrayVaccines.push({ "date": data[i].date, "n": data[i].vaccines / 20 })//VERDI VACCINI OGNI 10 MILIONI DI ABITANTI
                        arrayCases.push({ "date": data[i].date, "n": data[i].case / 10 })//BLU CASI OGNI 10 MILIONI DI ABITANTI
                    }
                    let max = 0;
                    for (let i = 0; i < 1100; i++) {
                        if (Number(arrayCases[i].n) > max) {
                            max = Number(arrayCases[i].n)
                            // console.log(max)

                        }
                    }

                    //Inserisco i dati dentro alle mappe
                    mapDeath.set("death", arrayDeath)
                    mapVaccines.set("vaccines", arrayVaccines)
                    mapCases.set("cases", arrayCases)

                    // Asse X (date)
                    const x = d3.scaleTime()
                        .domain(d3.extent(data, function (d) { return d.date; }))
                        .range([0, clientWidth]);
                    const xAxis = svg.append("g")
                        .attr("transform", `translate(0, ${clientHeight})`)
                        .call(d3.axisBottom(x));

                    // Add Y 
                    const y = d3.scaleLinear()
                        .domain([0, 25000])
                        .range([clientHeight, 0]);
                    svg.append("g")
                        .call(d3.axisLeft(y));

                    // Funzioni che gestiscono i tooltip
                    // EVIDENZIARE DEATH
                    const highlightDeath = function (event, d) {

                        //INGRIGISCO GLI ALTRI
                        d3.selectAll("path.cases1")
                            .transition()
                            .delay("100")
                            .duration("10")
                            .style("stroke", "lightgrey")
                            .style("opacity", 0.7)
                            .style("stroke-width", 1);

                        d3.selectAll("path.vaccines1")
                            .transition()
                            .delay("100")
                            .duration("10")
                            .style("stroke", "lightgrey")
                            .style("opacity", 0.7)
                            .style("stroke-width", 1);

                        //RIDISEGNO SOPRA LA LINEA EVIDENZIATA
                        svg.selectAll(".line")
                            .data(mapDeath)
                            .join("path")
                            .attr("class", "death1")
                            .attr("fill", "none")
                            .transition()
                            .delay("100")
                            .duration("10")
                            .attr("stroke", function (d) { return color(d[0]) })
                            .attr("stroke-width", 2)
                            .attr("d", function (d) {
                                return d3.line()
                                    .x(function (d) { return x(d.date); })
                                    .y(function (d) { return y(+d.n); })
                                    (d[1])
                            })
                    }

                    // EVIDENZIARE CASES
                    const highlightCases = function (event, d) {

                        d3.selectAll("path.death1")
                            .transition()
                            .delay("100")
                            .duration("10")
                            .style("stroke", "lightgrey")
                            .style("opacity", 0.7)
                            .style("stroke-width", 1);

                        d3.selectAll("path.vaccines1")
                            .transition()
                            .delay("100")
                            .duration("10")
                            .style("stroke", "lightgrey")
                            .style("opacity", 0.7)
                            .style("stroke-width", 1);

                        svg.selectAll(".line")
                            .data(mapCases)
                            .join("path")
                            .attr("class", "cases1")
                            .attr("fill", "none")
                            .transition()
                            .delay("100")
                            .duration("10")
                            .attr("stroke", function (d) { return color(d[0]) })
                            .attr("stroke-width", 2)
                            .attr("d", function (d) {
                                return d3.line()
                                    .x(function (d) { return x(d.date); })
                                    .y(function (d) { return y(+d.n); })
                                    (d[1])
                            })
                    }

                    // EVIDENZIARE VACCINES
                    const highlightVaccines = function (event, d) {

                        d3.selectAll("path.death1")
                            .transition()
                            .delay("100")
                            .duration("10")
                            .style("stroke", "lightgrey")
                            .style("opacity", 0.7)
                            .style("stroke-width", 1);

                        d3.selectAll("path.cases1")
                            .transition()
                            .delay("100")
                            .duration("10")
                            .style("stroke", "lightgrey")
                            .style("opacity", 0.7)
                            .style("stroke-width", 1);

                        svg.selectAll(".line")
                            .data(mapVaccines)
                            .join("path")
                            .attr("class", "vaccines1")
                            .transition()
                            .delay("100")
                            .duration("10")
                            .attr("fill", "none")
                            .attr("stroke", function (d) { return color(d[0]) })
                            .attr("stroke-width", 2)
                            .attr("d", function (d) {
                                return d3.line()
                                    .x(function (d) { return x(d.date); })
                                    .y(function (d) { return y(+d.n); })
                                    (d[1])
                            })
                    }

                    //FUNZIONE PER QUANDO TOLGO IL MOUSE
                    const doNotHighlight = function (event, d) {

                        // RIMUOVO LE VECCHIE LINEE
                        svg.selectAll("path.cases1").remove();
                        svg.selectAll("path.death1").remove();
                        svg.selectAll("path.vaccines1").remove();

                        // LE RIDISEGNO DA ZERO
                        // Draw DEATH
                        svg.selectAll(".line")
                            .data(mapDeath)
                            .join("path")
                            .attr("class", "death1")
                            .attr("fill", "none")
                            .attr("stroke", function (d) { return color(d[0]) })
                            .attr("stroke-width", 1.5)
                            .attr("d", function (d) {
                                return d3.line()
                                    .x(function (d) { return x(d.date); })
                                    .y(function (d) { return y(+d.n); })
                                    (d[1])
                            })
                            .on("mouseover", highlightDeath)
                            .on("mouseleave", doNotHighlight)

                        // Draw CASES
                        svg.selectAll(".line")
                            .data(mapCases)
                            .join("path")
                            .attr("class", "cases1")
                            .attr("fill", "none")
                            .attr("stroke", function (d) { return color(d[0]) })
                            .attr("stroke-width", 1.5)
                            .attr("d", function (d) {
                                return d3.line()
                                    .x(function (d) { return x(d.date); })
                                    .y(function (d) { return y(+d.n); })
                                    (d[1])
                            })
                            .on("mouseover", highlightCases)
                            .on("mouseleave", doNotHighlight)

                        // Draw VACCINES
                        svg.selectAll(".line")
                            .data(mapVaccines)
                            .join("path")
                            .attr("class", "vaccines1")
                            .attr("fill", "none")
                            .attr("stroke", function (d) { return color(d[0]) })
                            .attr("stroke-width", 1.5)
                            .attr("d", function (d) {
                                return d3.line()
                                    .x(function (d) { return x(d.date); })
                                    .y(function (d) { return y(+d.n); })
                                    (d[1])
                            })
                            .on("mouseover", highlightVaccines)
                            .on("mouseleave", doNotHighlight)
                    }

                    // Color palette
                    const color = d3.scaleOrdinal()
                        .range(['#ff0831', '#08c0ff', '#35bc35'])

                    // Draw DEATH
                    svg.selectAll(".line")
                        .data(mapDeath)
                        .join("path")
                        .attr("class", "death1")
                        .attr("fill", "none")
                        .attr("stroke", function (d) { return color(d[0]) })
                        .attr("stroke-width", 1.5)
                        .attr("d", function (d) {
                            return d3.line()
                                .x(function (d) { return x(d.date); })
                                .y(function (d) { return y(+d.n); })
                                (d[1])
                        })
                        .on("mouseover", highlightDeath)
                        .on("mouseleave", doNotHighlight)

                    // Draw CASES
                    svg.selectAll(".line")
                        .data(mapCases)
                        .join("path")
                        .attr("class", "cases1")
                        .attr("fill", "none")
                        .attr("stroke", function (d) { return color(d[0]) })
                        .attr("stroke-width", 1.5)
                        .attr("d", function (d) {
                            return d3.line()
                                .x(function (d) { return x(d.date); })
                                .y(function (d) { return y(+d.n); })
                                (d[1])
                        })
                        .on("mouseover", highlightCases)
                        .on("mouseleave", doNotHighlight)

                    // Draw VACCINES
                    svg.selectAll(".line")
                        .data(mapVaccines)
                        .join("path")
                        .attr("class", "vaccines1")
                        .attr("fill", "none")
                        .attr("stroke", function (d) { return color(d[0]) })
                        .attr("stroke-width", 1.5)
                        .attr("d", function (d) {
                            return d3.line()
                                .x(function (d) { return x(d.date); })
                                .y(function (d) { return y(+d.n); })
                                (d[1])
                        })
                        .on("mouseover", highlightVaccines)
                        .on("mouseleave", doNotHighlight)

                    let width = window.innerWidth;
                    let fontSize;

                    //Label
                    svg.append("text")
                        .attr("class", "legend1B")
                        .attr("x", "-50")
                        .attr("y", 100)
                        .text("Death [unit]")
                        .style("font-size", "90%")
                        .attr('transform', 'rotate(270 ' + 10 + ' ' + 170 + ')')
                        .attr("alignment-baseline", "middle")
                    svg.append("text")
                        .attr("class", "legend1B")
                        .attr("x", "45%")
                        .attr("y", 435)
                        .text("Date")
                        .style("font-size", "100%")
                        .attr("alignment-baseline", "middle")

                    //LEGEND

                    if (clientWidth > 690) {
                        //DEATH
                        svg.append("rect")
                            .attr("x", "70%")
                            .attr("y", -2)
                            .attr('width', "6%")
                            .attr('height', 5)
                            .style("fill", "#ff0831")
                            .on("mouseover", highlightDeath)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 5)
                            .text("Weekly deaths")
                            .style("font-size", "80%")
                            .on("mouseover", highlightDeath)
                            .on("mouseleave", doNotHighlight)
                        //CASES
                        svg.append("rect")
                            .attr("x", "70%")
                            .attr("y", 30)
                            .attr('width', "6%")
                            .attr('height', 5)
                            .style("fill", "#08c0ff")
                            .on("mouseover", highlightCases)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 30)
                            .text("Weekly cases every ")
                            .style("font-size", "80%")
                            .on("mouseover", highlightCases)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 43)
                            .text("100'000 people")
                            .style("font-size", "80%")
                            .on("mouseover", highlightCases)
                            .on("mouseleave", doNotHighlight)
                        //ICU
                        svg.append("rect")
                            .attr("x", "70%")
                            .attr("y", 61)
                            .attr('width', "6%")
                            .attr('height', 5)
                            .style("fill", "#35bc35")
                            .on("mouseover", highlightVaccines)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 63)
                            .text("Weekly vaccines every")
                            .style("font-size", "80%")
                            .on("mouseover", highlightVaccines)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 76)
                            .text("50'000 people")
                            .style("font-size", "80%")
                            .on("mouseover", highlightVaccines)
                            .on("mouseleave", doNotHighlight)
                    }
                    else {
                        //DEATH
                        svg.append("rect")
                            .attr("x", "70%")
                            .attr("y", -2)
                            .attr('width', "6%")
                            .attr('height', 5)
                            .style("fill", "#ff0831")
                            .on("mouseover", highlightDeath)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 5)
                            .text("Weekly deaths")
                            .style("font-size", "1vi")
                            .on("mouseover", highlightDeath)
                            .on("mouseleave", doNotHighlight)
                        //CASES
                        svg.append("rect")
                            .attr("x", "70%")
                            .attr("y", 30)
                            .attr('width', "6%")
                            .attr('height', 5)
                            .style("fill", "#08c0ff")
                            .on("mouseover", highlightCases)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 25)
                            .text("Weekly cases ")
                            .style("font-size", "1vi")
                            .on("mouseover", highlightCases)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 35)
                            .text("every 100k")
                            .style("font-size", "1vi")
                            .on("mouseover", highlightCases)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 45)
                            .text("people")
                            .style("font-size", "1vi")
                            .on("mouseover", highlightCases)
                            .on("mouseleave", doNotHighlight)

                        //ICU
                        svg.append("rect")
                            .attr("x", "70%")
                            .attr("y", 65)
                            .attr('width', "6%")
                            .attr('height', 5)
                            .style("fill", "#35bc35")
                            .on("mouseover", highlightVaccines)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 57)
                            .text("Weekly")
                            .style("font-size", "1vi")
                            .on("mouseover", highlightVaccines)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 67)
                            .text("vaccines")
                            .style("font-size", "1vi")
                            .on("mouseover", highlightVaccines)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 77)
                            .text("every 50k")
                            .style("font-size", "1vi")
                            .on("mouseover", highlightVaccines)
                            .on("mouseleave", doNotHighlight)
                        svg.append("text")
                            .attr("x", "77%")
                            .attr("y", 87)
                            .text("people")
                            .style("font-size", "1vi")
                            .on("mouseover", highlightVaccines)
                            .on("mouseleave", doNotHighlight)


                    }
                })




    }
})




