$(document).ready(function () {

    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 550 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    const svg = d3.select("#graph_3B")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //Inizializzo mappe e array dove inserirò i dati
    let arrayGDP = [];
    let arrayInflation = [];
    let mapGDP = new Map();
    let mapInflation = new Map();

    // Leggo i dati
    d3.csv("../../csv/economia/graph_3B.csv",

        // Formatto le date
        // QUANDO SI AGGOIORNA IL CSV, OCCHIO AL FORMATO
        function (d) {
            return { date: d3.timeParse("%d-%m-%Y")(d.date), gdp: d.gdp, inflation: d.inflation }
        }).then(

            function (data) {

                // Inserisco i dati entro agli array
                for (let i = 0; i < data.length; i++) {
                    arrayGDP.push({ "date": data[i].date, "n": data[i].gdp })
                    arrayInflation.push({ "date": data[i].date, "n": data[i].inflation })
                }

                //Inserisco i dati dentro alle mappe
                mapGDP.set("gdp", arrayGDP)
                mapInflation.set("inflation", arrayInflation)

                // Asse X (date)
                const x = d3.scaleTime()
                    .domain(d3.extent(data, function (d) { return d.date; }))
                    .range([0, width]);
                const xAxis = svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x));

                // Add Y 
                const y = d3.scaleLinear()
                    .domain([0, 100])
                    .range([height, 0]);
                svg.append("g")
                    .call(d3.axisLeft(y));

                // Funzioni che gestiscono i tooltip
                // EVIDENZIARE GDP
                const highlightGDP = function (event, d) {

                    //INGRIGISCO GLI ALTRI
                    d3.selectAll("path.inflation")
                        .transition()
                        .delay("100")
                        .duration("10")
                        .style("stroke", "lightgrey")
                        .style("opacity", "1")
                        .style("stroke-width", "3");

                    //RIDISEGNO SOPRA LA LINEA EVIDENZIATA
                    svg.selectAll(".line")
                        .data(mapGDP)
                        .join("path")
                        .attr("class", "gdp")
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

                // EVIDENZIARE INFLATION
                const highlightInflation = function (event, d) {

                    d3.selectAll("path.gdp")
                        .transition()
                        .delay("100")
                        .duration("10")
                        .style("stroke", "lightgrey")
                        .style("opacity", "1")
                        .style("stroke-width", "3");

                    svg.selectAll(".line")
                        .data(mapInflation)
                        .join("path")
                        .attr("class", "inflation")
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


                //FUNZIONE PER QUANDO TOLGO IL MOUSE
                const doNotHighlight = function (event, d) {

                    // RIMUOVO LE VECCHIE LINEE
                    svg.selectAll("path.inflation").remove();
                    svg.selectAll("path.gdp").remove();

                    // LE RIDISEGNO DA ZERO

                    // Draw GDP
                    svg.selectAll(".line")
                        .data(mapGDP)
                        .join("path")
                        .attr("class", "gdp")
                        .attr("fill", "none")
                        .attr("stroke", function (d) { return color(d[0]) })
                        .attr("stroke-width", 1.5)
                        .attr("d", function (d) {
                            return d3.line()
                                .x(function (d) { return x(d.date); })
                                .y(function (d) { return y(+d.n); })
                                (d[1])
                        })
                        .on("mouseover", highlightGDP)
                        .on("mouseleave", doNotHighlight)

                    // Draw INFLATION
                    svg.selectAll(".line")
                        .data(mapInflation)
                        .join("path")
                        .attr("class", "inflation")
                        .attr("fill", "none")
                        .attr("stroke", function (d) { return color(d[0]) })
                        .attr("stroke-width", 1.5)
                        .attr("d", function (d) {
                            return d3.line()
                                .x(function (d) { return x(d.date); })
                                .y(function (d) { return y(+d.n); })
                                (d[1])
                        })
                        .on("mouseover", highlightGDP)
                        .on("mouseleave", doNotHighlight)
                }

                // Color palette
                const color = d3.scaleOrdinal()
                    .range(['#e41a1c', '#377eb8', '#4daf4a'])

                // Draw GDP
                svg.selectAll(".line")
                    .data(mapGDP)
                    .join("path")
                    .attr("class", "gdp")
                    .attr("fill", "none")
                    .attr("stroke", function (d) { return color(d[0]) })
                    .attr("stroke-width", 1.5)
                    .attr("d", function (d) {
                        return d3.line()
                            .x(function (d) { return x(d.date); })
                            .y(function (d) { return y(+d.n); })
                            (d[1])
                    })
                    .on("mouseover", highlightGDP)
                    .on("mouseleave", doNotHighlight)

                // Draw INFLATION
                svg.selectAll(".line")
                    .data(mapInflation)
                    .join("path")
                    .attr("class", "inflation")
                    .attr("fill", "none")
                    .attr("stroke", function (d) { return color(d[0]) })
                    .attr("stroke-width", 1.5)
                    .attr("d", function (d) {
                        return d3.line()
                            .x(function (d) { return x(d.date); })
                            .y(function (d) { return y(+d.n); })
                            (d[1])
                    })
                    .on("mouseover", highlightGDP)
                    .on("mouseleave", doNotHighlight)


                //LEGEND
                svg.append("rect")
                    .attr("x", -75)
                    .attr("y", -40)
                    .attr('width', 50)
                    .attr('height', 60)
                    .style("fill", "red")
                    .on("mouseover", highlightGDP)
                    .on("mouseleave", doNotHighlight)

                svg.append("rect")
                    .attr("x", -75)
                    .attr("y", 30)
                    .attr('width', 50)
                    .attr('height', 20)
                    .style("fill", "blue")
                    .on("mouseover", highlightInflation)
                    .on("mouseleave", doNotHighlight)

            })
})




