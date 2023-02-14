$(document).ready(function () {

    let aux = 0;
    draw()
    addEventListener("resize", (event) => {
        draw()
    })
    function draw() {

        let clientHeight = document.getElementById('graph_4C').clientHeight - 90;
        let clientWidth = document.getElementById('graph_4C').clientWidth - 120;

        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 30, bottom: 50, left: 70 };
        if (aux == 1) {
            $("#graph_4C").empty();
        }
        aux = 1;
        // append the svg object to the body of the page
        const svg = d3.select("#graph_4C")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        //Label
        svg.append("text")
            .attr("class", "legend1B")
            .attr("x", "-4%")
            .attr("y", 110)
            .text("Death [unit]")
            .style("font-size", "100%")
            .attr('transform', 'rotate(270 ' + 10 + ' ' + 180 + ')')
            .attr("alignment-baseline", "middle")
        svg.append("text")
            .attr("class", "legend1B")
            .attr("x", "40%")
            .attr("y", 400)
            .text("Date")
            .style("font-size", "100%")
            .attr("alignment-baseline", "middle")

        let dataProva = [];

        //Read the data
        d3.csv("../../csv/visione_globale/graph_1A.csv",

            // When reading the csv, I must format variables:
            function (d) {
                return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value }
            }).then(

                // Now I can use this dataset:
                function (data) {

                    // NUMERO DI MORTI GLOBALI PER OGNI SETTIMANA
                    for (i = 0; i < (data.length / 7) - 1; i++) {
                        dataProva[i] = data[i * 7]
                        dataProva[i].value =
                            Number(data[i * 7].value) +
                            Number(data[i * 7 + 1].value) +
                            Number(data[i * 7 + 3].value) +
                            Number(data[i * 7 + 4].value) +
                            Number(data[i * 7 + 5].value) +
                            Number(data[i * 7 + 6].value)

                        dataProva[i].value = dataProva[i].value / 7;
                    }


                    // Add X axis --> it is a date format
                    const x = d3.scaleTime()
                        .domain(d3.extent(dataProva, function (d) { return d.date; }))
                        .range([0, clientWidth]);
                    let xAxis = svg.append("g")
                        .attr("transform", `translate(0, ${clientHeight})`)
                        .call(d3.axisBottom(x));

                    // Add Y axis
                    const y = d3.scaleLinear()
                        .domain([0, d3.max(dataProva, function (d) { return +d.value; })])
                        .range([clientHeight, 0]);
                    let yAxis = svg.append("g")
                        .call(d3.axisLeft(y));

                    // Add a clipPath: everything out of this area won't be drawn.
                    const clip = svg.append("defs").append("svg:clipPath")
                        .attr("id", "clip")
                        .append("svg:rect")
                        .attr("width", clientWidth)
                        .attr("height", clientHeight)
                        .attr("x", 0)
                        .attr("y", 0);

                    // Add brushing
                    const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
                        .extent([[0, 0], [clientWidth, clientHeight]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

                    // Create the line variable: where both the line and the brush take place
                    const line = svg.append('g')
                        .attr("clip-path", "url(#clip)")

                    // Add the line
                    line.append("path")
                        .datum(dataProva)
                        .attr("class", "line")  // I add the class line to be able to modify this line later on.
                        .attr("fill", "none")
                        .attr("stroke", "#ff0831")
                        .attr("stroke-width", 2)
                        .attr("d", d3.line()
                            .x(function (d) { return x(d.date) })
                            .y(function (d) { return y(d.value) })
                        )

                    // Add the brushing
                    line
                        .append("g")
                        .attr("class", "brush")
                        .call(brush);

                    // A function that set idleTimeOut to null
                    let idleTimeout
                    function idled() { idleTimeout = null; }

                    // A function that update the chart for given boundaries
                    function updateChart(event, d) {

                        // What are the selected boundaries?
                        extent = event.selection

                        // If no selection, back to initial coordinate. Otherwise, update X axis domain
                        if (!extent) {
                            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                            x.domain([4, 8])
                        } else {
                            x.domain([x.invert(extent[0]), x.invert(extent[1])])
                            line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
                        }

                        // Update axis and line position
                        xAxis.transition().duration(1000).call(d3.axisBottom(x))
                        line
                            .select('.line')
                            .transition()
                            .duration(1000)
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.value) })
                            )
                    }

                    // If user double click, reinitialize the chart
                    svg.on("dblclick", function () {
                        x.domain(d3.extent(dataProva, function (d) { return d.date; }))
                        xAxis.transition().call(d3.axisBottom(x))
                        line
                            .select('.line')
                            .transition()
                            .attr("d", d3.line()
                                .x(function (d) { return x(d.date) })
                                .y(function (d) { return y(d.value) })
                            )
                    });

                })
    }
})




