$(document).ready(function () {

    // Dimensioni e margini del grafico
    const margin = { top: 10, right: 40, bottom: 40, left: 80 },
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    const size = 200;


    // SVG
    const svg = d3.select("#graph_1A")
        .append("svg")
        //.attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .attr('width', '100%')
        .attr('viewBox', '0 0 600 300 ')
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

    // Leggo i dati
    d3.csv("../../csv/visione_globale/graph_1A.csv",

        // Formatto le date
        function (d) {
            return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value }
        }).then(

            function (data) {

                // Asse X (date)
                const x = d3.scaleTime()
                    .domain(d3.extent(data, function (d) { return d.date; }))
                    .range([0, width]);
                xAxis = svg.append("g")
                    .attr("transform", `translate(0, ${height})`)
                    .call(d3.axisBottom(x));

                // Asse Y
                const y = d3.scaleLinear()
                    .domain([0, d3.max(data, function (d) { return +d.value; })])
                    .range([height, 0]);
                yAxis = svg.append("g")
                    .call(d3.axisLeft(y));

                // Aggiungo clipPath: tutto quello fuori da quest'area non verrà disegnato
                const clip = svg.append("defs").append("svg:clipPath")
                    .attr("id", "clip")
                    .append("svg:rect")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("x", 0)
                    .attr("y", 0);

                // Aggiungo evidenziatore
                const brush = d3.brushX()
                    .extent([[0, 0], [width, height]])     // Inizializzo area evidenziatore: inizia at 0,0 e finisce a width,height: significa che seleziono tutto il grafico
                    .on("end", updateChart)                // Ogni volta che la zona evidenziata cambia, lancio 'updateChart' 

                // Creo le linee dell'evidenziatore
                const line = svg.append('g')
                    .attr("clip-path", "url(#clip)")

                // Disegno la linea del grafico
                line.append("path")
                    .datum(data)
                    .attr("class", "line")  // Aggiungo classe "line" per poterla modificare dopo
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.line()
                        .x(function (d) { return x(d.date) })
                        .y(function (d) { return y(d.value) })
                    )

                // Aggiugno l'evidenziatore
                line
                    .append("g")
                    .attr("class", "brush")
                    .call(brush);

                // Funzioni che gestiscono l'evidenziatore
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

                // Se doppio click, reinizializzo
                svg.on("dblclick", function () {
                    x.domain(d3.extent(data, function (d) { return d.date; }))
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

    // Legend
    svg.append("text")
        .attr("x", -220)
        .attr("y", -60)
        .text("Death")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")
        .attr("transform", "rotate(-90)")
    svg.append("text")
        .attr("x", 150)
        .attr("y", 435)
        .text("Date")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle")
})




