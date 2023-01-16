$(document).ready(function () {

    const margin = { top: 85, right: 0, bottom: 10, left: 0 },
        width = 550 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom,
        innerRadius = 100,
        outerRadius = Math.min(width, height) / 2;   // The outerRadius goes from the middle of the SVG area to the border

    const svg = d3.select("#graph_2A")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);

    d3.csv("../../csv/sanità/graph_2A.csv").then(function (data) {

        // Scale
        const x = d3.scaleBand()
            .range([0, 2 * Math.PI])            // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
            .align(0)                           // This does nothing
            .domain(data.map(d => d.Country));  // The domain of the X axis is the list of states.
        const y = d3.scaleRadial()
            .range([innerRadius, outerRadius])  // Domain will be define later.
            .domain([0, 14000]);                // Domain of Y is from 0 to the max seen in the data

        //  Show tooltip
        const showTooltip = function (event, d) {

            let legend = d3.select(this).datum()

            svg.append("text")
                .attr("class", "legend1")
                .text(legend.Country)
                .attr("text-anchor", "middle")
                .attr("y", -15)
                .style("font-size", "18px")
                .attr("alignment-baseline", "middle")

            svg.append("text")
                .attr("class", "legend2")
                .attr("text-anchor", "middle")
                .attr("y", 5)
                .text(legend.Value + " death")
                .style("font-size", "18px")
                .attr("alignment-baseline", "middle")
        }

        // Hide tooltip
        const hideTooltip = function (event, d) {
            d3.select('text.legend1').remove()
            d3.select('text.legend2').remove()
        }

        // Add the bars
        svg.append("g")
            .selectAll("path")
            .data(data)
            .join("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.arc()     // imagine your doing a part of a donut plot
                .innerRadius(innerRadius)
                .outerRadius(d => y(d['Value']))
                .startAngle(d => x(d.Country))
                .endAngle(d => x(d.Country) + x.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius))
            .on("mouseover", showTooltip)
            .on("mouseleave", hideTooltip)

        // Add the labels
        svg.append("g")
            .selectAll("g")
            .data(data)
            .join("g")
            .attr("text-anchor", function (d) { return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function (d) { return "rotate(" + ((x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d['Value']) + 10) + ",0)"; })
            .append("text")
            .text(function (d) { return (d.Country) })
            .attr("transform", function (d) { return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            .style("font-size", "11px")
            .attr("alignment-baseline", "middle")
            .on("mouseover", showTooltip)
            .on("mouseleave", hideTooltip)
    });
})




