$(document).ready(function () {
    // UNITA' DI MISURA: PERCENTUALE RISPETTO AL PERIODO PRECEDENTE (BASATA SU PERSONA)
    // LINK: https://ec.europa.eu/eurostat/databrowser/view/NAMA_10_A10_E__custom_85496/bookmark/table?lang=en&bookmarkId=0d3c5276-dfb4-4342-9834-a4fbec282768

    //FINITO

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#graph_3D")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Variables for checking the buttons
    const buttonItaly = document.getElementById("italy")
    const buttonFrance = document.getElementById("france")
    const buttonSpain = document.getElementById("spain")
    const buttonGermany = document.getElementById("germany")

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

                    // Put in array data of France
                    if (data[i].country == "Spain") {
                        arraySpain[data[0].country] = data[0].employment
                        auxObj = { "date": data[i].date, "employment": data[i].employment }
                        arraySpain.push(auxObj)
                    }


                }
                // Draw only axes
                // Add X axis
                const x3D = d3.scaleTime()
                    .domain(d3.extent(arrayItaly, function (d) { return d.date; }))
                    .range([0, width]);
                svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x3D));


                // Add Y axis
                const y3D = d3.scaleLinear()
                    .domain([-5, +5])
                    .range([height, 0]);
                svg.append("g")
                    .call(d3.axisLeft(y3D));


                // Event listener that check when a box is checked
                addEventListener("click", function (e) {

                    // Delete all previous lines including the axes
                    svg.selectAll("path").remove();
                    svg.selectAll("text").remove();



                    // Redraw the axes
                    const x = d3.scaleTime()
                        .domain(d3.extent(arrayItaly, function (d) { return d.date; }))
                        .range([0, width]);
                    svg.append("g")
                        .attr("transform", `translate(0, ${height})`)
                        .call(d3.axisBottom(x));
                    const y = d3.scaleLinear()
                        .domain([-5, +5])
                        .range([height, 0]);
                    svg.append("g")
                        .call(d3.axisLeft(y));

                    // Check which button is checked and draw the lines
                    //ITALY
                    if (buttonItaly.checked) {
                        svg.append("path")
                            .datum(arrayItaly)
                            .attr("fill", "none")
                            .attr("stroke", "steelblue")
                            .attr("stroke-width", 1.5)
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
                            .attr("stroke", "red")
                            .attr("stroke-width", 1.5)
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
                            .attr("stroke", "green")
                            .attr("stroke-width", 1.5)
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
                            .attr("stroke", "yellow")
                            .attr("stroke-width", 1.5)
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.employment) })
                            )
                    }
                })
            })
})




