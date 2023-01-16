$(document).ready(function () {

    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 1400 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    const svg = d3.select("#graph_2E")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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
        // QUANDO SI AGGOIORNA IL CSV, OCCHIO AL FORMATO
        function (d) {
            return { date: d3.timeParse("%d-%m-%Y")(d.date), death: d.death, vaccines: d.vaccines, case: d.cases }
        }).then(

            function (data) {

                // Inserisco i dati entro agli array
                for (let i = 0; i < data.length; i++) {
                    arrayDeath.push({ "date": data[i].date, "n": data[i].death })
                    arrayVaccines.push({ "date": data[i].date, "n": data[i].vaccines })
                    arrayCases.push({ "date": data[i].date, "n": data[i].case })
                }

                //Inserisco i dati dentro alle mappe
                mapDeath.set("death", arrayDeath)
                mapVaccines.set("vaccines", arrayVaccines)
                mapCases.set("cases", arrayCases)

                // Asse X (date)
                const x = d3.scaleTime()
                    .domain(d3.extent(data, function (d) { return d.date; }))
                    .range([0, width]);
                xAxis = svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x));

                // Add Y 
                const y = d3.scaleLinear()
                    .domain([0, 100])
                    .range([height, 0]);
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
                        .style("opacity", "1")
                        .style("stroke-width", "3");

                    d3.selectAll("path.vaccines1")
                        .transition()
                        .delay("100")
                        .duration("10")
                        .style("stroke", "lightgrey")
                        .style("opacity", "1")
                        .style("stroke-width", "3");

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
                        .attr("stroke-width", 5)
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
                        .style("opacity", "1")
                        .style("stroke-width", "3");

                    d3.selectAll("path.vaccines1")
                        .transition()
                        .delay("100")
                        .duration("10")
                        .style("stroke", "lightgrey")
                        .style("opacity", "1")
                        .style("stroke-width", "3");

                    svg.selectAll(".line")
                        .data(mapCases)
                        .join("path")
                        .attr("class", "cases1")
                        .attr("fill", "none")
                        .transition()
                        .delay("100")
                        .duration("10")
                        .attr("stroke", function (d) { return color(d[0]) })
                        .attr("stroke-width", 1.5)
                        .attr("d", function (d) {
                            return d3.line()
                                .x(function (d) { return x(d.date); })
                                .y(function (d) { return y(+d.n); })
                                (d[1])
                        })

                }

                // EVIDENZIARE VACCINES
                const highlightICU = function (event, d) {

                    d3.selectAll("path.death1")
                        .transition()
                        .delay("100")
                        .duration("10")
                        .style("stroke", "lightgrey")
                        .style("opacity", "1")
                        .style("stroke-width", "3");

                    d3.selectAll("path.cases1")
                        .transition()
                        .delay("100")
                        .duration("10")
                        .style("stroke", "lightgrey")
                        .style("opacity", "1")
                        .style("stroke-width", "3");

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
                        .on("mouseover", highlightICU)
                        .on("mouseleave", doNotHighlight)
                }

                // Color palette
                const color = d3.scaleOrdinal()
                    .range(['#e41a1c', '#377eb8', '#4daf4a'])

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
                    .on("mouseover", highlightICU)
                    .on("mouseleave", doNotHighlight)

                //LEGEND
                svg.append("rect")
                    .attr("x", -75)
                    .attr("y", -40)
                    .attr('width', 50)
                    .attr('height', 60)
                    .style("fill", "red")
                    .on("mouseover", highlightDeath)
                    .on("mouseleave", doNotHighlight)

                svg.append("rect")
                    .attr("x", -75)
                    .attr("y", 30)
                    .attr('width', 50)
                    .attr('height', 20)
                    .style("fill", "blue")
                    .on("mouseover", highlightCases)
                    .on("mouseleave", doNotHighlight)

                svg.append("rect")
                    .attr("x", -75)
                    .attr("y", 60)
                    .attr('width', 50)
                    .attr('height', 20)
                    .style("fill", "green")
                    .on("mouseover", highlightICU)
                    .on("mouseleave", doNotHighlight)
            })
})




