$(document).ready(function () {
    // UNITA' DI MISURA: PERCENTUALE RISPETTO AL PERIODO PRECEDENTE (BASATA SU PERSONA)
    // LINK: https://ec.europa.eu/eurostat/databrowser/view/NAMA_10_A10_E__custom_85496/bookmark/table?lang=en&bookmarkId=0d3c5276-dfb4-4342-9834-a4fbec282768

    //FINITO

    let aux = 0;
    draw()
    addEventListener("resize", (event) => {
        draw()
    })
    function draw() {

        let clientHeight = document.getElementById('graph_3D').clientHeight - 50;
        let clientWidth = document.getElementById('graph_3D').clientWidth - 70;

        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 40, left: 60 };

        if (aux == 1) {
            $("#graph_3D").empty();
        }
        aux = 1;
        // append the svg object to the body of the page
        const svg = d3.select("#graph_3D")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Variables for checking the buttons
        const buttonItaly = document.getElementById("italy")
        const buttonFrance = document.getElementById("france")
        const buttonSpain = document.getElementById("spain")
        const buttonGermany = document.getElementById("germany")

        //Label
        svg.append("text")
            .attr("class", "legend3D")
            .attr("x", "-8%")
            .attr("y", 250)
            .text("Percentage change on previous period [%]")
            .style("font-size", "100%")
            .attr('transform', 'rotate(270 ' + 10 + ' ' + 300 + ')')
            .attr("alignment-baseline", "middle")
        svg.append("text")
            .attr("class", "legend3D")
            .attr("x", "40%")
            .attr("y", 435)
            .text("Date")
            .style("font-size", "100%")
            .attr("alignment-baseline", "middle")

        //Read the data
        d3.csv("../../csv/economia/graph_3D.csv",

            // When reading the csv, I must format variables:
            function (d) {
                return { country: d.geo, date: d3.timeParse("%Y")(d.TIME_PERIOD), employment: d.OBS_VALUE }
            }).then(

                // Now I can use this dataset:
                function (data) {
                    // Auxiliary variables for construct the data
                    let arrayItaly = [];
                    let arrayFrance = [];
                    let arrayGermany = [];
                    let arraySpain = [];

                    let auxObj = {}

                    // Insert in the right array the correspondent data
                    for (i = 0; i < data.length; i++) {

                        // Put in array data of Italy
                        if (data[i].country == "Italy") {

                            arrayItaly[data[0].country] = data[0].employment
                            auxObj = { "date": data[i].date, "employment": data[i].employment }
                            arrayItaly.push(auxObj)
                        }

                        // Put in array data of France
                        if (data[i].country == "France") {
                            arrayFrance[data[0].country] = data[0].employment
                            auxObj = { "date": data[i].date, "employment": data[i].employment }
                            arrayFrance.push(auxObj)
                        }

                        if (data[i].country == "Germany (until 1990 former territory of the FRG)") {
                            arrayGermany[data[0].country] = data[0].employment
                            auxObj = { "date": data[i].date, "employment": data[i].employment }
                            arrayGermany.push(auxObj)
                        }


                        if (data[i].country == "Spain") {
                            arraySpain[data[0].country] = data[0].employment
                            auxObj = { "date": data[i].date, "employment": data[i].employment }
                            arraySpain.push(auxObj)
                        }


                    }

                    svg.selectAll("path").remove();
                    svg.selectAll("text").remove();

                    //Label
                    svg.append("text")
                        .attr("class", "legend3D")
                        .attr("x", "-50")
                        .attr("y", 250)
                        .text("Percentage change on previous period [%]")
                        .style("font-size", "100%")
                        .attr('transform', 'rotate(270 ' + 10 + ' ' + 300 + ')')
                        .attr("alignment-baseline", "middle")
                    svg.append("text")
                        .attr("class", "legend3D")
                        .attr("x", "40%")
                        .attr("y", 435)
                        .text("Date")
                        .style("font-size", "100%")
                        .attr("alignment-baseline", "middle")



                    // Redraw the axes
                    const x = d3.scaleTime()
                        .domain(d3.extent(arrayGermany, function (d) { return d.date; }))
                        .range([0, clientWidth]);
                    svg.append("g")
                        .attr("transform", `translate(0, ${clientHeight})`)
                        .call(d3.axisBottom(x));
                    const y = d3.scaleLinear()
                        .domain([-5, +5])
                        .range([clientHeight, 0]);
                    svg.append("g")
                        .call(d3.axisLeft(y));

                    // Check which button is checked and draw the lines
                    //ITALY
                    if (buttonItaly.checked) {
                        svg.append("path")
                            .datum(arrayItaly)
                            .attr("fill", "none")
                            .attr("stroke", "#ff3e6b")
                            .attr("stroke-width", 2)
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.employment) })
                            )
                    }


                    //FRANCE
                    if (buttonFrance.checked) {
                        svg.append("path")
                            .datum(arrayFrance)
                            .attr("fill", "none")
                            .attr("stroke", "#ffbf29")
                            .attr("stroke-width", 2)
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.employment) })
                            )
                    }

                    //FRANCE
                    if (buttonSpain.checked) {
                        svg.append("path")
                            .datum(arraySpain)
                            .attr("fill", "none")
                            .attr("stroke", "#46d366")
                            .attr("stroke-width", 2)
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.employment) })
                            )
                    }

                    //FRANCE
                    if (buttonGermany.checked) {
                        svg.append("path")
                            .datum(arrayGermany)
                            .attr("fill", "none")
                            .attr("stroke", "#00d6ff")
                            .attr("stroke-width", 2)
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.employment) })
                            )
                    }


                    // Event listener that check when a box is checked
                    addEventListener("click", function (e) {

                        // Delete all previous lines including the axes
                        svg.selectAll("path").remove();
                        svg.selectAll("text").remove();

                        //Label
                        svg.append("text")
                            .attr("class", "legend3D")
                            .attr("x", "-8%")
                            .attr("y", 250)
                            .text("Percentage change on previous period [%]")
                            .style("font-size", "100%")
                            .attr('transform', 'rotate(270 ' + 10 + ' ' + 300 + ')')
                            .attr("alignment-baseline", "middle")
                        svg.append("text")
                            .attr("class", "legend3D")
                            .attr("x", "40%")
                            .attr("y", 435)
                            .text("Date")
                            .style("font-size", "100%")
                            .attr("alignment-baseline", "middle")



                        // Redraw the axes
                        const x = d3.scaleTime()
                            .domain(d3.extent(arrayGermany, function (d) { return d.date; }))
                            .range([0, clientWidth]);
                        svg.append("g")
                            .attr("transform", `translate(0, ${clientHeight})`)
                            .call(d3.axisBottom(x));
                        const y = d3.scaleLinear()
                            .domain([-5, +5])
                            .range([clientHeight, 0]);
                        svg.append("g")
                            .call(d3.axisLeft(y));

                        // Check which button is checked and draw the lines
                        //ITALY
                        if (buttonItaly.checked) {
                            svg.append("path")
                                .datum(arrayItaly)
                                .attr("fill", "none")
                                .attr("stroke", "#ff3e6b")
                                .attr("stroke-width", 2)
                                .attr("d", d3.line()
                                    .x(function (d) { return x(d.date) })
                                    .y(function (d) { return y(d.employment) })
                                )
                        }


                        //FRANCE
                        if (buttonFrance.checked) {
                            svg.append("path")
                                .datum(arrayFrance)
                                .attr("fill", "none")
                                .attr("stroke", "#ffbf29")
                                .attr("stroke-width", 2)
                                .attr("d", d3.line()
                                    .x(function (d) { return x(d.date) })
                                    .y(function (d) { return y(d.employment) })
                                )
                        }

                        //FRANCE
                        if (buttonSpain.checked) {
                            svg.append("path")
                                .datum(arraySpain)
                                .attr("fill", "none")
                                .attr("stroke", "#46d366")
                                .attr("stroke-width", 2)
                                .attr("d", d3.line()
                                    .x(function (d) { return x(d.date) })
                                    .y(function (d) { return y(d.employment) })
                                )
                        }

                        //FRANCE
                        if (buttonGermany.checked) {
                            svg.append("path")
                                .datum(arrayGermany)
                                .attr("fill", "none")
                                .attr("stroke", "#00d6ff")
                                .attr("stroke-width", 2)
                                .attr("d", d3.line()
                                    .x(function (d) { return x(d.date) })
                                    .y(function (d) { return y(d.employment) })
                                )
                        }
                    })
                })
    }
})




