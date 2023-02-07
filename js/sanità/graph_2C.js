$(document).ready(function () {

    //DATI DEL 2020
    // set the dimensions and margins of the graph
    const width = 680,
        height = 450,
        margin = 10;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin

    // Append the svg object to the div 
    const svg = d3.select("#graph_2C")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Parse the Data
    d3.csv("../../csv/sanità/graph_2C.csv").then(function (data) {

        // Write data inside an arry
        const dataArray = {
            "65-74": parseInt(data[3].death),
            "74+": parseInt(data[4].death),
            "0-24": parseInt(data[0].death),
            "25-44": parseInt(data[1].death),
            "45-64": parseInt(data[2].death),
        }



        let total = dataArray["0-24"] + dataArray["25-44"] + dataArray["45-64"] + dataArray["65-74"] + dataArray["74+"]


        //Color palette
        const color = d3.scaleOrdinal()
            .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
            .range(d3.schemeDark2);

        // Compute the position of each group on the pie:
        const pie = d3.pie()
            .sort(null) // Do not sort group by size
            .value(d => d[1])
        const data_ready = pie(Object.entries(dataArray))


        // The arc generator
        const arc = d3.arc()
            // This is the size of the donut holes
            .innerRadius(radius * 0.4)
            .outerRadius(radius * 0.7)

        // The arc of the slices not highlighted
        const arcHigh = d3.arc()
            .innerRadius(radius * 0.2)
            .outerRadius(radius * 0.4)

        // Another arc that won't be drawn. Just for labels positioning
        const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9)

        // TOOLTIP MOUSEOVER
        const highlight = function (event, d) {

            // Diminusico la dimensione delle slices
            d3.selectAll("path.slice")
                .attr('d', arcHigh)

            // Reimposto la dimensione della slice selezionata alla dimensione normale
            d3.select(this)
                .attr('d', arc)

            // Carico i valori per la legenda
            let legend = d3.select(this).datum()

            // Scrivo la leggenda
            svg.append("text")
                .attr("class", "legend")
                .attr("text-anchor", "middle")
                .attr("y", -210)
                .text("Age range " + legend.data[0])
                .style("font-size", "18px")
                .attr("alignment-baseline", "middle")
            svg.append("text")
                .attr("class", "legend")
                .attr("text-anchor", "middle")
                .attr("y", -190)
                .text(legend.data[1] + " death" + " - " + ((legend.data[1] / total) * 100).toFixed(2) + "%")
                .style("font-size", "18px")
                .attr("alignment-baseline", "middle")

            // Rimuovo gli indicatori
            d3.selectAll('text.legend_2C').remove()
            d3.selectAll('polyline.legend_2C').remove()
        }

        // TOOLTIP MOUSELEAVE
        const doNotHighlight = function (event, d) {

            // Rimuovo legenda e tutte le slices
            d3.selectAll("path.slice").remove()
            d3.selectAll('text.legend').remove()

            // Ridisegno tutto il grafico
            svg
                .selectAll('allSlices')
                .data(data_ready)
                .join('path')
                .attr("class", "slice")
                .attr('d', arc)
                .attr('fill', d => color(d.data[1]))
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 0.7)
                .on("mouseover", highlight)
                .on("mouseleave", doNotHighlight)

            // Polylines
            svg
                .selectAll('allPolylines')
                .data(data_ready)
                .join('polyline')
                .attr("class", "legend_2C")
                .attr("stroke", "black")
                .style("fill", "none")
                .attr("stroke-width", 1)
                .attr('points', function (d) {
                    const posA = arc.centroid(d)
                    const posB = outerArc.centroid(d)
                    const posC = outerArc.centroid(d);
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                    posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
                    return [posA, posB, posC]
                })

            // Labels
            svg
                .selectAll('allLabels')
                .data(data_ready)
                .join('text')
                .attr("class", "legend_2C")
                .text(d => d.data[0])
                .attr('transform', function (d) {
                    const pos = outerArc.centroid(d);
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                    return `translate(${pos})`;
                })
                .style('text-anchor', function (d) {
                    const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                    return (midangle < Math.PI ? 'start' : 'end')
                })
        }


        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
            .selectAll('allSlices')
            .data(data_ready)
            .join('path')
            .attr("class", "slice")
            .attr('d', arc)
            .attr('fill', d => color(d.data[1]))
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
            .on("mouseover", highlight)
            .on("mouseleave", doNotHighlight)

        // Add the polylines between chart and labels:
        svg
            .selectAll('allPolylines')
            .data(data_ready)
            .join('polyline')
            .attr("class", "legend_2C")
            .attr("stroke", "black")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function (d) {
                const posA = arc.centroid(d) // line insertion in the slice
                const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
                const posC = outerArc.centroid(d); // Label position = almost the same as posB
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
                return [posA, posB, posC]
            })

        // Add the polylines between chart and labels:
        svg
            .selectAll('allLabels')
            .data(data_ready)
            .join('text')
            .attr("class", "legend_2C")
            .text(d => d.data[0])
            .attr('transform', function (d) {
                const pos = outerArc.centroid(d);
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .style('text-anchor', function (d) {
                const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                return (midangle < Math.PI ? 'start' : 'end')
            })
    })
})




