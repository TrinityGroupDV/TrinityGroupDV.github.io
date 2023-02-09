$(document).ready(async function () {
    let aux = 0;
    draw()
    addEventListener("resize", (event) => {
        draw()
    })

    function draw() {
        let clientHeight = document.getElementById('graph_2D').clientHeight - 50;
        let clientWidth = document.getElementById('graph_2D').clientWidth - 100;

        // Set margin
        const margin = { top: 10, right: 20, bottom: 30, left: 50 };
        if (aux == 1) {
            $("#graph_2D").empty();
        }
        aux = 1;
        // Append the svg object to the body of the page
        const svg = d3.select("#graph_2D")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)

        // Map and projection
        const path = d3.geoPath();
        const projection = d3.geoMercator()
            .scale(400)
            .center([30, 50])
            .translate([clientWidth / 1.79, clientHeight / 1.6]);

        // Data and color scale
        let map = new Map()
        const colorScale = d3.scaleThreshold()
            .domain([0, 1, 2, 3, 4])
            .range(["grey", "#2282FF", "#FAFF22", "#FFA922", "#FF3B22"])

        //Aux variables for first ever draw map
        checkFirstDrawMap = 0;

        let date;

        // Draw First Map
        stayAtHomeDataset(0)

        //Auxiliary variables for first redrawing after changing datasets
        let firstRedraw1 = 1;
        let firstRedraw2, firstRedraw3 = 0;

        // Check drop menu 
        addEventListener("mouseover", function (e) {
            let auxDrop = document.getElementById("select_graph_2D").value;

            //If FIRST dataset
            if (auxDrop == 1) {
                firstRedraw2 = 0;
                firstRedraw3 = 0;

                //If first redraw after changing dataset
                if (firstRedraw1 == 0) {
                    stayAtHomeDataset(document.getElementById("myRange2D").value)
                    firstRedraw1 = 1;
                }
                else if (firstRedraw1 == 1) {
                    // Check slider
                    slider = document.getElementById("myRange2D");
                    slider.oninput = function () {
                        stayAtHomeDataset(this.value)
                        console.log(this.value)
                    }
                }
            }
            //If SECOND dataset
            else if (auxDrop == 2) {
                firstRedraw1 = 0;
                firstRedraw3 = 0;

                //If first redraw after changing dataset
                if (firstRedraw2 == 0) {
                    testingDataset(document.getElementById("myRange2D").value)
                    firstRedraw2 = 1;
                }
                else if (firstRedraw2 == 1) {
                    // Check slider
                    slider = document.getElementById("myRange2D");
                    slider.oninput = function () {
                        testingDataset(this.value)
                    }
                }

            }
            //If THIRD dataset
            else if (auxDrop == 3) {
                firstRedraw1 = 0;
                firstRedraw2 = 0;

                //If first redraw after changing dataset
                if (firstRedraw3 == 0) {
                    faceCoveringsDataset(document.getElementById("myRange2D").value)
                    firstRedraw3 = 1;
                }
                //If is not
                else if (firstRedraw3 == 1) {
                    // Check slider
                    slider = document.getElementById("myRange2D");
                    slider.oninput = function () {
                        faceCoveringsDataset(this.value)
                    }
                }
            }
        })

        // Draw Map function

        // FIRST DATASET
        function stayAtHomeDataset(dataSlider) {

            // Load external data and boot
            Promise.all([
                d3.json("../europe.geojson"),
                d3.json("../../csv/sanità/graph_2D_1.json").then(function (data) {
                    //Put data that i need in array based on date
                    for (let i = 0; i < data.length; i++) {
                        map.set(data[i].title, data[i].date[dataSlider][1])
                    }
                    date = data[0].date[dataSlider][0]
                })
            ]).then(function (loadData) {

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

                    // Draw the map
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

                //If is not
                else if (checkFirstDrawMap == 1) {

                    // Set the color of each country
                    svg.selectAll("path")
                        .data(topo.features)
                        .join("path")
                        .attr("fill", function (d) {
                            d.total = map.get(d.properties.iso_a3) || 0;
                            return colorScale(d.total);
                        })
                }











                // LEGEND
                //considero 1200px come 100%
                //Cover
                svg.append("rect")
                    .attr("x", 100)
                    .attr("y", 755)
                    .attr("width", "100%")
                    .attr('height', 43)
                    .style("fill", "white")

                // No data
                svg.append("rect")
                    .attr("x", 100)
                    .attr("y", 780)
                    .attr("width", "15%")
                    .attr('height', 15)
                    .style("fill", "grey")
                    .attr('stroke', 'grey')
                svg.append("text")
                    .attr("x", "17.5%")
                    .attr("y", 770)
                    .text("No data")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")

                // First block
                svg.append("rect")
                    .attr("x", "35%")
                    .attr("y", 780)
                    .attr("width", "25%")
                    .attr('height', 15)
                    .style("fill", "#2282FF")
                    .attr('stroke', 'grey')
                svg.append("text")
                    .attr("x", "45%")
                    .attr("y", 770)
                    .text("No measures")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")

                // Second block
                svg.append("rect")
                    .attr("x", "60%")
                    .attr("y", 780)
                    .attr("width", "25%")
                    .attr('height', 15)
                    .style("fill", "#FAFF22")
                    .attr('stroke', 'grey')
                svg.append("text")
                    .attr("x", "70%")
                    .attr("y", 770)
                    .text("Recommended")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")

                //Third block
                svg.append("rect")
                    .attr("x", "85%")
                    .attr("y", 780)
                    .attr("width", "25%")
                    .attr('height', 15)
                    .style("fill", "#FFA922")
                    .attr('stroke', 'grey')
                svg.append("text")
                    .attr("x", "90%")
                    .attr("y", 770)
                    .text("Required (except essentials)")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")

        
                //Fourth block
                svg.append("rect")
                    .attr("x", "90%") 
                    .attr("y", 780)
                    .attr('width', "25%") 
                    .attr('height', 15)
                    .style("fill", "#FF3B22")
                    .attr('stroke', 'grey')
                svg.append("text")
                    .attr("x", "90%") 
                    .attr("y", 770)
                    .text("Required (few exceptions)")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")




            })
        }

        //SECOND DATASET
        function testingDataset(dataSlider) {

            // Load external data and boot
            Promise.all([
                d3.json("../europe.geojson"),
                d3.json("../../csv/sanità/graph_2D_2.json").then(function (data) {
                    //Put data that i need in array based on date
                    for (let i = 0; i < data.length; i++) {
                        map.set(data[i].title, data[i].date[dataSlider][1])
                    }
                    date = data[0].date[dataSlider][0]
                })
            ]).then(function (loadData) {

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

                // Set the color of each country
                svg.selectAll("path")
                    .data(topo.features)
                    .join("path")
                    .attr("fill", function (d) {
                        d.total = map.get(d.properties.iso_a3) || 0;
                        return colorScale(d.total);
                    })

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
                    .text("No testing policy")
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
                    .attr("x", 580)
                    .attr("y", 770)
                    .text("Symptoms & key group")
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
                    .attr("x", 830)
                    .attr("y", 770)
                    .text("Anyone with symptoms")
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
                    .attr("x", 1100)
                    .attr("y", 770)
                    .text("Open public testing")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")
            })
        }

        function faceCoveringsDataset(dataSlider) {

            // Load external data and boot
            Promise.all([
                d3.json("../europe.geojson"),
                d3.json("../../csv/sanità/graph_2D_3.json").then(function (data) {
                    //Put data that i need in array based on date
                    for (let i = 0; i < data.length; i++) {
                        map.set(data[i].title, data[i].date[dataSlider][1])
                    }
                    date = data[0].date[dataSlider][0]
                })
            ]).then(function (loadData) {

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

                    // Draw the map
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

                //If is not
                else if (checkFirstDrawMap == 1) {

                    // Set the color of each country
                    svg.selectAll("path")
                        .data(topo.features)
                        .join("path")
                        .attr("fill", function (d) {
                            d.total = map.get(d.properties.iso_a3) || 0;
                            return colorScale(d.total);
                        })
                }

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
    }
});





