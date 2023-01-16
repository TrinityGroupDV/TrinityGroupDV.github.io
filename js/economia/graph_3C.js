$(document).ready(function () {

    // set the dimensions and margins of the graph
    const width = 450,
        height = 450,
        margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#graph_3C")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    d3.csv("../../csv/economia/graph_3C.csv").then(function (data) {

        data1 = { it: data[0].duemila19, industry: data[1].duemila19, cars: data[2].duemila19, wears: data[3].duemila19 }
        data2 = { it: data[0].duemila20, industry: data[1].duemila20, cars: data[2].duemila20, wears: data[3].duemila20 }



        // set the color scale
        const color = d3.scaleOrdinal()
            .domain(["a", "b", "c", "d", "e", "f"])
            .range(d3.schemeDark2);

        $("button").click(function () {
            butt = this.value

            if (butt == 1) {
                update(data1)
            }
            if (butt == 2) {
                update(data2)
            }
        });

        // A function that create / update the plot for a given variable:
        function update(data) {

            // Compute the position of each group on the pie:
            const pie = d3.pie()
                .value(function (d) { return d[1]; })
                .sort(function (a, b) { return d3.ascending(a.key, b.key); }) // This make sure that group order remains the same in the pie chart
            const data_ready = pie(Object.entries(data))

            const arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(radius)

            // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
            const u = svg
                .selectAll('path')
                .data(data_ready)


            u
                .join('path')
                .transition()
                .duration(1000)
                .attr('d', arcGenerator)
                .attr('fill', function (d) { return (color(d.data[0])) })
                .attr("stroke", "black")
                .style("stroke-width", "2px")
                .style("opacity", 1)



            // Now add the annotation. Use the centroid method to get the best coordinates

            const s = svg
                .selectAll('text')
                .data(data_ready)
            s
                .join('text')
                .transition()
                .duration(1000)
                .text(function (d) { return d.data[0] })
                .attr("transform", function (d) { return `translate(${arcGenerator.centroid(d)})` })
                .style("text-anchor", "middle")
                .style("font-size", 17)
        }

        // Initialize the plot with the first dataset
        update(data1)
    })
})




