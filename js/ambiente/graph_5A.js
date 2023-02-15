$(document).ready(async function () {
    let aux = 0;
    draw()

    addEventListener("resize", (event) => {
        draw()
    })

    function draw() {

        let clientHeight = document.getElementById('graph_2D').clientHeight - 60;
        let clientWidth = document.getElementById('graph_2D').clientWidth - 100;

        // Set margin
        const margin = { top: 10, right: 20, bottom: 30, left: 50 };
        if (aux == 1) {
            $("#graph_5A").empty();
        }
        aux = 1;

        // append the svg object to the body of the page
        const svg = d3.select("#graph_5A")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Map and projection
        const path = d3.geoPath();
        const projection = d3.geoMercator()
            .scale(600)
            .center([20, 51])
            .translate([clientWidth / 1.79, clientHeight / 1.6]);

        // Load external data and boot
        d3.json("../europe.geojson").then(function (data) {

            const markers = [
                { long: 9.083, lat: 42.149, group: "A", size: 34 }, // corsica
                { long: 7.26, lat: 43.71, group: "A", size: 14 }, // nice
                { long: 2.349, lat: 48.864, group: "B", size: 87 }, // Paris
                { long: -1.397, lat: 43.664, group: "B", size: 41 }, // Hossegor
                { long: 3.075, lat: 50.640, group: "C", size: 78 }, // Lille
                { long: -3.83, lat: 58, group: "C", size: 12 } // Morlaix
            ];

            const color = d3.scaleOrdinal()
                .domain(["A", "B", "C"])
                .range(["#402D54", "#D18975", "#8FD175"])

            const size = d3.scaleLinear()
                .domain([1, 100])  // What's in the data
                .range([4, 50])  // Size in pixel

            // Draw the map
            svg.append("g")
                .selectAll("path")
                .data(data.features)
                .join("path")
                .attr("fill", "#69b3a2")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .style("stroke", "#fff")

            svg
                .selectAll("myCircles")
                .data(markers)
                .join("circle")
                .attr("cx", d => projection([d.long, d.lat])[0])
                .attr("cy", d => projection([d.long, d.lat])[1])
                .attr("r", d => size(d.size))
                .style("fill", d => color(d.group))
                .attr("stroke", d => color(d.group))
                .attr("stroke-width", 3)
                .attr("fill-opacity", .4)

            const valuesToShow = [10, 50, 100]
            const xCircle = 100
            const xLabel = 170
            const yCircle = 400
            svg
                .selectAll("legend")
                .data(valuesToShow)
                .join("circle")
                .attr("cx", xCircle)
                .attr("cy", d => yCircle - size(d))
                .attr("r", d => size(d))
                .style("fill", "none")
                .attr("stroke", "black")
            // Add legend: segments
            svg
                .selectAll("legend")
                .data(valuesToShow)
                .join("line")
                .attr('x1', d => xCircle + size(d))
                .attr('x2', xLabel)
                .attr('y1', d => yCircle - size(d))
                .attr('y2', d => yCircle - size(d))
                .attr('stroke', 'black')
                .style('stroke-dasharray', ('2,2'))

            // Add legend: labels
            svg
                .selectAll("legend")
                .data(valuesToShow)
                .join("text")
                .attr('x', xLabel)
                .attr('y', d => yCircle - size(d))
                .text(d => d)
                .style("font-size", 10)
                .attr('alignment-baseline', 'middle')

        })
    }
})





