$(document).ready(function () {
    //TODO: unità di misura, label assi, colori, legenda

    //LINK: https://ec.europa.eu/eurostat/databrowser/view/SDG_01_10__custom_4922621/default/table?lang=en


    let aux = 0;
    draw()
    addEventListener("resize", (event) => {
        draw()
    })
    function draw() {

        let clientHeight = document.getElementById('graph_4A').clientHeight - 50;
        let clientWidth = document.getElementById('graph_4A').clientWidth - 80;

        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 40, left: 70 };
        if (aux == 1) {
            $("#graph_4A").empty();
        }
        aux = 1;

        // append the svg object to the body of the page
        const svg = d3.select("#graph_4A")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Variables for checking the buttons
        const buttonItaly = document.getElementById("italy_4A")
        const buttonFrance = document.getElementById("france_4A")
        const buttonSpain = document.getElementById("spain_4A")
        const buttonGermany = document.getElementById("germany_4A")


        //Label
        svg.append("text")
            .attr("class", "legend3D")
            .attr("x", "-80")
            .attr("y", 130)
            .text("Percentage [%]")
            .style("font-size", "1vi")
            .attr('transform', 'rotate(270 ' + 10 + ' ' + 190 + ')')
            .attr("alignment-baseline", "middle")
        svg.append("text")
            .attr("class", "legend3D")
            .attr("x", "40%")
            .attr("y", 435)
            .text("Date")
            .style("font-size", "100%")
            .attr("alignment-baseline", "middle")



        //Read the data
        d3.csv("../../csv/società/graph_4A.csv",

            // When reading the csv, I must format variables:
            function (d) {
                return { country: d.geo, date: d3.timeParse("%Y")(d.TIME_PERIOD), poverty: d.OBS_VALUE }
            }).then(

                // Now I can use this dataset:
                function (data) {



                    // Auxiliary variables for construct the data
                    let arrayItaly = [];
                    let arrayFrance = [];
                    let arrayGermany = [];
                    let arraySpain = [];
                    let auxObj = {}

                    // console.log(data[0])
                    // Insert in the right array the correspondent data
                    for (i = 0; i < data.length; i++) {

                        // Put in array data of Italy
                        if (data[i].country == "Italy") {
                            arrayItaly[data[0].country] = data[0].poverty
                            auxObj = { "date": data[i].date, "poverty": data[i].poverty }
                            arrayItaly.push(auxObj)
                        }

                        // Put in array data of France
                        if (data[i].country == "France") {
                            arrayFrance[data[0].country] = data[0].poverty
                            auxObj = { "date": data[i].date, "poverty": data[i].poverty }
                            arrayFrance.push(auxObj)
                        }

                        if (data[i].country == "Germany (until 1990 former territory of the FRG)") {
                            arrayGermany[data[0].country] = data[0].poverty
                            auxObj = { "date": data[i].date, "poverty": data[i].poverty }
                            arrayGermany.push(auxObj)
                        }

                        // Put in array data of France
                        if (data[i].country == "Spain") {
                            arraySpain[data[0].country] = data[0].poverty
                            auxObj = { "date": data[i].date, "poverty": data[i].poverty }
                            arraySpain.push(auxObj)
                        }


                    }


                    // Draw only axes
                    // Add X axis






                    // Delete all previous lines including the axes
                    d3.selectAll("path.line_4A").remove();
                    svg.selectAll("text").remove();

                    //Label
                    svg.append("text")
                        .attr("class", "legend3D")
                        .attr("x", "-8%")
                        .attr("y", 130)
                        .text("Percentage [%]")
                        .style("font-size", "100%")
                        .attr('transform', 'rotate(270 ' + 10 + ' ' + 190 + ')')
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
                        .domain(d3.extent(arrayItaly, function (d) { return d.date; }))
                        .range([0, clientWidth]);
                    svg.append("g")
                        .attr("transform", `translate(0, ${clientHeight})`)
                        .call(d3.axisBottom(x));
                    const y = d3.scaleLinear()
                        .domain([15, 30])
                        .range([clientHeight, 0]);
                    svg.append("g")
                        .call(d3.axisLeft(y));

                    // Check which button is checked and draw the lines
                    //ITALY
                    if (buttonItaly.checked) {
                        svg.append("path")
                            .datum(arrayItaly)
                            .attr("class", "line_4A")
                            .attr("fill", "none")
                            .attr("stroke", "#ff3e6b")
                            .attr("stroke-width", 2)
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.poverty) })
                            )
                    }


                    //FRANCE
                    if (buttonFrance.checked) {
                        svg.append("path")
                            .datum(arrayFrance)
                            .attr("fill", "none")
                            .attr("class", "line_4A")
                            .attr("stroke", "#ffbf29")
                            .attr("stroke-width", 2)
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.poverty) })
                            )
                    }

                    //FRANCE
                    if (buttonSpain.checked) {
                        svg.append("path")
                            .datum(arraySpain)
                            .attr("fill", "none")
                            .attr("class", "line_4A")
                            .attr("stroke", "#46d366")
                            .attr("stroke-width", 2)
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.poverty) })
                            )
                    }

                    //FRANCE
                    if (buttonGermany.checked) {
                        svg.append("path")
                            .datum(arrayGermany)
                            .attr("fill", "none")
                            .attr("class", "line_4A")
                            .attr("stroke", "#00d6ff")
                            .attr("stroke-width", 2)
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.poverty) })
                            )
                    }



                    // Event listener that check when a box is checked
                    addEventListener("click", function (e) {

                        // Delete all previous lines including the axes
                        d3.selectAll("path.line_4A").remove();
                        svg.selectAll("text").remove();

                        //Label
                        svg.append("text")
                            .attr("class", "legend3D")
                            .attr("x", "-8%")
                            .attr("y", 130)
                            .text("Percentage [%]")
                            .style("font-size", "100%")
                            .attr('transform', 'rotate(270 ' + 10 + ' ' + 190 + ')')
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
                            .domain(d3.extent(arrayItaly, function (d) { return d.date; }))
                            .range([0, clientWidth]);
                        svg.append("g")
                            .attr("transform", `translate(0, ${clientHeight})`)
                            .call(d3.axisBottom(x));
                        const y = d3.scaleLinear()
                            .domain([15, 30])
                            .range([clientHeight, 0]);
                        svg.append("g")
                            .call(d3.axisLeft(y));

                        // Check which button is checked and draw the lines
                        //ITALY
                        if (buttonItaly.checked) {
                            svg.append("path")
                                .datum(arrayItaly)
                                .attr("class", "line_4A")
                                .attr("fill", "none")
                                .attr("stroke", "#ff3e6b")
                                .attr("stroke-width", 2)
                                .attr("d", d3.line()
                                    .x(function (d) { return x(d.date) })
                                    .y(function (d) { return y(d.poverty) })
                                )
                        }


                        //FRANCE
                        if (buttonFrance.checked) {
                            svg.append("path")
                                .datum(arrayFrance)
                                .attr("fill", "none")
                                .attr("class", "line_4A")
                                .attr("stroke", "#ffbf29")
                                .attr("stroke-width", 2)
                                .attr("d", d3.line()
                                    .x(function (d) { return x(d.date) })
                                    .y(function (d) { return y(d.poverty) })
                                )
                        }

                        //FRANCE
                        if (buttonSpain.checked) {
                            svg.append("path")
                                .datum(arraySpain)
                                .attr("fill", "none")
                                .attr("class", "line_4A")
                                .attr("stroke", "#46d366")
                                .attr("stroke-width", 2)
                                .attr("d", d3.line()
                                    .x(function (d) { return x(d.date) })
                                    .y(function (d) { return y(d.poverty) })
                                )
                        }

                        //FRANCE
                        if (buttonGermany.checked) {
                            svg.append("path")
                                .datum(arrayGermany)
                                .attr("fill", "none")
                                .attr("class", "line_4A")
                                .attr("stroke", "#00d6ff")
                                .attr("stroke-width", 2)
                                .attr("d", d3.line()
                                    .x(function (d) { return x(d.date) })
                                    .y(function (d) { return y(d.poverty) })
                                )
                        }
                    })
                })


    }


})




