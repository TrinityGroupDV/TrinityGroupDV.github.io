$(document).ready(function () {

    let aux = 0;
    draw()
    addEventListener("resize", (event) => {
        draw()
    })
    function draw() {

        let clientHeight = document.getElementById('graph_2E').clientHeight - 80;
        let clientWidth = document.getElementById('graph_2E').clientWidth - 150;

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
            // QUANDO SI AGGIORNA IL CSV, OCCHIO AL FORMATO
            function (d) {
                return { date: d3.timeParse("%Y-%m-%d")(d.date), death: d.death, vaccines: d.vaccines, case: d.cases }
            }).then(

                function (data) {

                    // Inserisco i dati entro agli array
                    for (let i = 0; i < data.length; i++) {
                        arrayDeath.push({ "date": data[i].date, "n": data[i].death }) //ROSSO
                        arrayVaccines.push({ "date": data[i].date, "n": data[i].vaccines })//VERDI VACCINI OGNI 10 MILIONI DI ABITANTI
                        arrayCases.push({ "date": data[i].date, "n": data[i].case })//BLU CASI OGNI 10 MILIONI DI ABITANTI
                    }
                    let max = 0;
                    for (let i = 0; i < 1100; i++) {
                        arrayCases[i].n > max
                        max = arrayCases[i]

                    }


                    console.log(arrayCases)

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
                        .domain([0, 500000])
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
                        .on("mouseover", highlightVaccines)
                        .on("mouseleave", doNotHighlight)

                    let width = window.innerWidth;
                    let fontSize;

                    /*  if (width < 1400) {
                          fontSize = "15";
                      } else if (width < 1800) {
                          fontSize = 18;
                      } else if (width < 2000) {
                          fontSize = 20;
                      }
                      else {
                          fontSize = 25;
                      }
  
                      console.log(width)
                      let font = fontSize + "px"
                      console.log(font)
  
                      console.log(width)*/

                    //Label
                    svg.append("text")
                        .attr("class", "legend1B")
                        .attr("x", "-4%")
                        .attr("y", 100)
                        .text("Death [unit]")
                        .style("font-size", "90%")
                        .attr('transform', 'rotate(270 ' + 10 + ' ' + 170 + ')')
                        .attr("alignment-baseline", "middle")
                    svg.append("text")
                        .attr("class", "legend1B")
                        .attr("x", "45%")
                        .attr("y", 410)
                        .text("Date")
                        .style("font-size", "100%")
                        .attr("alignment-baseline", "middle")


                    //LEGEND
                    //DEATH
                    svg.append("rect")
                        .attr("x", "75%")
                        .attr("y", -7)
                        .attr('width', "6%")
                        .attr('height', 5)
                        .style("fill", "red")
                        .on("mouseover", highlightDeath)
                        .on("mouseleave", doNotHighlight)
                    svg.append("text")
                        .attr("x", "82%")
                        .attr("y", 0)
                        .text("Death")
                        .style("font-size", "90%")
                        .on("mouseover", highlightDeath)
                        .on("mouseleave", doNotHighlight)
                    //CASES
                    svg.append("rect")
                        .attr("x", "75%")
                        .attr("y", 25)
                        .attr('width', "6%")
                        .attr('height', 5)
                        .style("fill", "blue")
                        .on("mouseover", highlightCases)
                        .on("mouseleave", doNotHighlight)
                    svg.append("text")
                        .attr("x", "82%")
                        .attr("y", 27)
                        .text("Cases every ")
                        .style("font-size", "80%")
                        .on("mouseover", highlightCases)
                        .on("mouseleave", doNotHighlight)
                    svg.append("text")
                        .attr("x", "82%")
                        .attr("y", 40)
                        .text("100'000 people")
                        .style("font-size", "80%")
                        .on("mouseover", highlightCases)
                        .on("mouseleave", doNotHighlight)

                    //ICU
                    svg.append("rect")
                        .attr("x", "75%")
                        .attr("y", 56)
                        .attr('width', "6%")
                        .attr('height', 5)
                        .style("fill", "green")
                        .on("mouseover", highlightVaccines)
                        .on("mouseleave", doNotHighlight)
                    svg.append("text")
                        .attr("x", "82%")
                        .attr("y", 57)
                        .text("Vaccines every")
                        .style("font-size", "80%")
                        .on("mouseover", highlightVaccines)
                        .on("mouseleave", doNotHighlight)
                    svg.append("text")
                        .attr("x", "82%")
                        .attr("y", 70)
                        .text("30'000 people")
                        .style("font-size", "80%")
                        .on("mouseover", highlightVaccines)
                        .on("mouseleave", doNotHighlight)
                })


    }
})




