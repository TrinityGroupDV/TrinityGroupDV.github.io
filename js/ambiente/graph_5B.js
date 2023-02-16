$(document).ready(function () {
    let aux = 0;
    draw()

    addEventListener("resize", (event) => {
        draw()
    })

    function draw() {

        let clientHeight = document.getElementById('graph_5B').clientHeight - 60;
        let clientWidth = document.getElementById('graph_5B').clientWidth - 100;

        // Set margin
        const margin = { top: 10, right: 20, bottom: 30, left: 50 };
        if (aux == 1) {
            $("#graph_5B").empty();
        }
        aux = 1;

        // append the svg object to the body of the page
        const svg = d3.select("#graph_5B")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        let array = []
        // Map and projection
        const path = d3.geoPath();
        const projection = d3.geoMercator()
            .scale(400)
            .center([20, 51])
            .translate([clientWidth / 1.79, clientHeight / 1.6]);

        Promise.all([
            // Load external data and boot
            d3.json("../europe.geojson"),
            d3.csv("../../csv/ambiente/ttr00012__custom_4979817_linear.csv", function (d) {
                array.push(d)
            })
        ]).then(function (loadData) {
            let topo = loadData[0]

            let temp = 0;
            let percentage = {}
            for (i = 0; i < 36; i++) {

                percentage[temp] = { 'Country': array[i].geo, "percentage": ((100 - (array[i + 1].OBS_VALUE * 100) / array[i].OBS_VALUE).toFixed(2)) }
                temp++
                i++
            }



            const markers = [
                { long: 13.20, lat: 47.20, country: "Austria", size: percentage[0].percentage / 1.5 },
                { long: 25, lat: 43, country: "Bulgaria", size: percentage[1].percentage / 1.5 },
                { long: 9, lat: 51, country: "Germany", size: percentage[2].percentage / 1.5 },
                { long: 22, lat: 39, country: "Greece", size: percentage[3].percentage / 1.5 },
                { long: -3, lat: 40, country: "Spain", size: percentage[4].percentage / 1.5 },
                { long: 2, lat: 46, country: "France", size: percentage[5].percentage / 1.5 },
                { long: 20, lat: 47, country: "Hungary", size: percentage[6].percentage / 1.5 },
                { long: 12.5, lat: 42.5, country: "Italy", size: percentage[7].percentage / 1.5 },
                { long: 10, lat: 62, country: "Norway", size: percentage[8].percentage / 1.5 },
                { long: 20, lat: 52, country: "Poland", size: percentage[9].percentage / 1.5 },
                { long: -8, lat: 40, country: "Portugal", size: percentage[10].percentage / 1.5 },
                { long: 25, lat: 46, country: "Romania", size: percentage[11].percentage / 1.5 },
                { long: 15, lat: 62, country: "Sweden", size: percentage[12].percentage / 1.5 },
                { long: -8, lat: 53, country: "Ireland", size: percentage[13].percentage / 1.5 },
                { long: 15.3, lat: 45.10, country: "Croatia", size: percentage[14].percentage / 1.5 },
                { long: 26, lat: 64, country: "Finland", size: percentage[15].percentage / 1.5 },
                { long: 4.55, lat: 52.23, country: "Netherlands", size: percentage[16].percentage },
                { long: -18, lat: 65, country: "Iceland", size: percentage[17].percentage / 1.5 }
            ];




            const color = d3.scaleOrdinal()
                .domain(["A"])
                .range(["#3b8bcc"])

            const size = d3.scaleLinear()
                .domain([1, 100])  // What's in the data
                .range([4, 50])  // Size in pixel

            // Draw the map
            svg.append("g")
                .selectAll("path")
                .data(topo.features)
                .join("path")
                .attr("fill", "#bababa")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .style("stroke", "#fff")

            // create a tooltip
            const Tooltip = d3.select("#graph_5B")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .style("font-size", "12px");

            // Show tooltip on mouseover
            const mouseover = function (event, d) {
                Tooltip.style("opacity", 1);
            }

            // Move tooltip on mousemove
            const mousemove = function (event, d) {
                Tooltip.html("Country: " + d.country + "<br>" + "Percentage: -" + (d.size * 1.5).toFixed(2) + "%")
                    .style("left", (event.offsetX + 20) + "px") // aggiunto 20px per spostare il tooltip a destra
                    .style("top", (event.offsetY - 20) + "px"); // sottratto 20px per spostare il tooltip in alto
            }

            // Hide tooltip on mouseout
            const mouseout = function (event, d) {
                Tooltip.style("opacity", 0);
            }

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
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseout)

            // Add legend: circles
            const valuesToShow = [100 / 1.5, 75 / 1.5, 50 / 1.5]
            const xCircle = 30
            const xLabel = 100
            const yCircle = 300
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

                .style("font-size", 10)
            svg.append("text")
                .attr("x", 105)
                .attr("y", 268)
                .attr("class", "legend5B")
                .text("100%")
                .style("font-size", 10)
            svg.append("text")
                .attr("x", 105)
                .attr("y", 277)
                .attr("class", "legend5B")
                .text("75%")
                .style("font-size", 10)
            svg.append("text")
                .attr("x", 105)
                .attr("y", 285)
                .attr("class", "legend5B")
                .text("50%")
                .style("font-size", 10)
        })
    }
})





