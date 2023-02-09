$(document).ready(async function () {
    //TODO: sistemare data, colori
    // Set margin
    const margin = { top: 10, right: 20, bottom: 30, left: 50 },
        width = 1400 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#graph_4B")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // Map and projection
    const path = d3.geoPath();
    const projection = d3.geoMercator()
        .scale(500)
        .center([20, 50])
        .translate([width / 1.79, height / 1.6]);

    // Data and color scale
    let map = new Map()
    const colorScale = d3.scaleThreshold()
        .domain([0, 1, 2, 3, 4])
        .range(["grey", "#2282FF", "#FAFF22", "#FFA922", "#FF3B22"])

    //Aux variables for first ever draw map
    let checkFirstDrawMap = 0;

    let date;

    // Draw First Map

    //Auxiliary variables for first redrawing after changing datasets
    let firstRedraw1 = 1;
    let firstRedraw2, firstRedraw3 = 0;

    // Check drop menu 


    //If FIRST dataset


    // Draw Map function

    // FIRST DATASET
    slider = document.getElementById("myRange4B");
    slider.oninput = function () {
        drawMap(this.value)
    }

    drawMap(0)


    // Load external data and boot
    function drawMap(dataSlider) {
        Promise.all([
            d3.json("../europe.geojson"),
            d3.csv("../../py/sanità/graph_2D/stay-at-home-covid.csv").then(function (data) {
                //Get only european country
                aux_var = {};
                temp2D = 0;
                for (i = 0; i < data.length; i++) {
                    if (data[i].Code === "ESP" ||
                        data[i].Code === "ITA" ||
                        data[i].Code === "DEU" ||
                        data[i].Code === "PRT" ||
                        data[i].Code === "IRL" ||
                        data[i].Code === "GBR" ||
                        data[i].Code === "CHE" ||
                        data[i].Code === "LUX" ||
                        data[i].Code === "BEL" ||
                        data[i].Code === "AUT" ||
                        data[i].Code === "SVN" ||
                        data[i].Code === "CZE" ||
                        data[i].Code === "POL" ||
                        data[i].Code === "SVK" ||
                        data[i].Code === "HUN" ||
                        data[i].Code === "SRB" ||
                        data[i].Code === "ALB" ||
                        data[i].Code === "GRC" ||
                        data[i].Code === "BGR" ||
                        data[i].Code === "ROU" ||
                        data[i].Code === "NOR" ||
                        data[i].Code === "SWE" ||
                        data[i].Code === "FIN" ||
                        data[i].Code === "FRA" ||
                        data[i].Code === "NLD" ||
                        data[i].Code === "DNK" ||
                        data[i].Code === "HRV" ||
                        data[i].Code === "MDA" ||
                        data[i].Code === "UKR" ||
                        data[i].Code === "BLR" ||
                        data[i].Code === "EST" ||
                        data[i].Code === "LVA" ||
                        data[i].Code === "RUS" ||
                        data[i].Code === "LTU" ||
                        data[i].Code === "BIH" ||
                        data[i].Code === "OWID_KOS" ||
                        data[i].Code === "ISL") {

                        // Get only datas on the selected date
                        if (data[i].Day === "2020-0" + (Number(dataSlider) + 1).toString() + "-01" ||
                            data[i].Day === "2020-" + (Number(dataSlider) + 1).toString() + "-01") {
                            aux_var[temp2D] = data[i]
                            temp2D++
                        }
                    }
                }
            })
        ]).then(function (loadData) {

            const colorScale = d3.scaleThreshold()
                .domain([0, 1, 2, 3, 4])
                .range(["grey", "#2282FF", "#FAFF22", "#FFA922", "#FF3B22"])

            map.clear()
            for (let i = 0; i < 37; i++) {

                map.set(aux_var[i].Code, aux_var[i].stay_home_requirements)
            }
            date = aux_var[dataSlider].Day
            date = date.substr(0, 7)

            // Write date
            d3.selectAll('text.legend_2D').remove()
            svg.append("text")
                .attr("class", "legend_2D")
                .attr("x", 10)
                .attr("y", 50)
                .text(date)
                .style("font-size", "30px")
                .attr("alignment-baseline", "middle")

            let topo = loadData[0]

            //If is first ever draw map

            if (checkFirstDrawMap == 0) {
                svg.append("g")
                    .selectAll("path")
                    .data(topo.features)
                    .join("path")
                    // draw each country
                    .attr("d", d3.geoPath()
                        .projection(projection)
                    )

                    // Set the color of each country
                    .attr("fill", function (d) {
                        d.total = map.get(d.properties.iso_a3) || 0;
                        return colorScale(d.total);
                    })
                    .style("stroke", "black")
                    .attr("stroke-width", 1)

                checkFirstDrawMap = 1;
            }
            // Draw the map
            else if (checkFirstDrawMap == 1) {
                svg.selectAll("path")
                    .data(topo.features)
                    .join("path")
                    .attr("fill", function (d) {
                        d.total = map.get(d.properties.iso_a3) || 0;
                        return colorScale(d.total);
                    })
            }


            checkFirstDrawMap = 1;




            // LEGEND
            //Cover
            svg.append("rect")
                .attr("x", 100)
                .attr("y", 755)
                .attr('width', 1200)
                .attr('height', 43)
                .style("fill", "white")

            // No data
            svg.append("rect")
                .attr("x", 100)
                .attr("y", 780)
                .attr('width', 150)
                .attr('height', 15)
                .style("fill", "grey")
                .attr('stroke', 'grey')
            svg.append("text")
                .attr("x", 135)
                .attr("y", 770)
                .text("No data")
                .style("font-size", "18px")
                .attr("alignment-baseline", "middle")

            // First block
            svg.append("rect")
                .attr("x", 300)
                .attr("y", 780)
                .attr('width', 250)
                .attr('height', 15)
                .style("fill", "#2282FF")
                .attr('stroke', 'grey')
            svg.append("text")
                .attr("x", 360)
                .attr("y", 770)
                .text("No measures")
                .style("font-size", "18px")
                .attr("alignment-baseline", "middle")

            // Second block
            svg.append("rect")
                .attr("x", 550)
                .attr("y", 780)
                .attr('width', 250)
                .attr('height', 15)
                .style("fill", "#FAFF22")
                .attr('stroke', 'grey')
            svg.append("text")
                .attr("x", 610)
                .attr("y", 770)
                .text("Recommended")
                .style("font-size", "18px")
                .attr("alignment-baseline", "middle")

            //Third block
            svg.append("rect")
                .attr("x", 800)
                .attr("y", 780)
                .attr('width', 250)
                .attr('height', 15)
                .style("fill", "#FFA922")
                .attr('stroke', 'grey')
            svg.append("text")
                .attr("x", 810)
                .attr("y", 770)
                .text("Required (except essentials)")
                .style("font-size", "18px")
                .attr("alignment-baseline", "middle")

            //Fourth block
            svg.append("rect")
                .attr("x", 1050)
                .attr("y", 780)
                .attr('width', 250)
                .attr('height', 15)
                .style("fill", "#FF3B22")
                .attr('stroke', 'grey')
            svg.append("text")
                .attr("x", 1070)
                .attr("y", 770)
                .text("Required (few exceptions)")
                .style("font-size", "18px")
                .attr("alignment-baseline", "middle")


        })

    }

})






