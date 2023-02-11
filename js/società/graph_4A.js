$(document).ready(function () {
    //TODO: unità di misura, label assi, colori, legenda

    //LINK: https://ec.europa.eu/eurostat/databrowser/view/ilc_li01/default/line?lang=en



    let aux = 0;
    draw()
    addEventListener("resize", (event) => {
        draw()
    })
    function draw() {

        let clientHeight = document.getElementById('graph_4A').clientHeight -40;
        let clientWidth = document.getElementById('graph_4A').clientWidth - 70;

        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 30, left: 40 };
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

        //Read the data
        d3.csv("../../csv/società/graph_4A.csv",

            // When reading the csv, I must format variables:
            function (d) {
                return { country: d.country, date: d3.timeParse("%Y")(d.date), poverty: d.poverty }
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
                        if (data[i].country == "italy") {
                            arrayItaly[data[0].country] = data[0].poverty
                            auxObj = { "date": data[i].date, "poverty": data[i].poverty }
                            arrayItaly.push(auxObj)
                        }

                        // Put in array data of France
                        if (data[i].country == "france") {
                            arrayFrance[data[0].country] = data[0].poverty
                            auxObj = { "date": data[i].date, "poverty": data[i].poverty }
                            arrayFrance.push(auxObj)
                        }

                        if (data[i].country == "germany") {
                            arrayGermany[data[0].country] = data[0].poverty
                            auxObj = { "date": data[i].date, "poverty": data[i].poverty }
                            arrayGermany.push(auxObj)
                        }

                        // Put in array data of France
                        if (data[i].country == "spain") {
                            arraySpain[data[0].country] = data[0].poverty
                            auxObj = { "date": data[i].date, "poverty": data[i].poverty }
                            arraySpain.push(auxObj)
                        }


                    }


                    // Draw only axes
                    // Add X axis
                    const x = d3.scaleTime()
                        .domain(d3.extent(arrayItaly, function (d) { return d.date; }))
                        .range([0, clientWidth]);
                    svg.append("g")
                        .attr("transform", `translate(0, ${clientHeight})`)
                        .call(d3.axisBottom(x));


                    // Add Y axis
                    const y = d3.scaleLinear()
                        .domain([8000, 16000])
                        .range([clientHeight, 0]);
                    svg.append("g")
                        .call(d3.axisLeft(y));


                    // Event listener that check when a box is checked
                    addEventListener("click", function (e) {

                        // Delete all previous lines including the axes
                        d3.selectAll("path.line_4A").remove();
                        svg.selectAll("text").remove();



                        // Redraw the axes
                        const x = d3.scaleTime()
                            .domain(d3.extent(arrayItaly, function (d) { return d.date; }))
                            .range([0, clientWidth]);
                        svg.append("g")
                            .attr("transform", `translate(0, ${clientHeight})`)
                            .call(d3.axisBottom(x));
                        const y = d3.scaleLinear()
                            .domain([8000, 16000])
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
                                .attr("stroke", "steelblue")
                                .attr("stroke-width", 1.5)
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
                                .attr("stroke", "red")
                                .attr("stroke-width", 1.5)
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
                                .attr("stroke", "green")
                                .attr("stroke-width", 1.5)
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
                                .attr("stroke", "yellow")
                                .attr("stroke-width", 1.5)
                                .attr("d", d3.line()
                                    .x(function (d) { return x(d.date) })
                                    .y(function (d) { return y(d.poverty) })
                                )
                        }
                    })
                })}

    })




