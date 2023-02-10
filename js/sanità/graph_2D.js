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

        // Append the svg object to the body of the page
        const svg = d3.select("#graph_2D")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)

        // Map and projection
        const path = d3.geoPath();
        const projection = d3.geoMercator()
            .scale(500)
            .center([20, 50])
            .translate([clientWidth / 1.79, clientHeight / 1.6]);

        // Data and color scale
        let map = new Map()
        const colorScale = d3.scaleThreshold()
            .domain([0, 1, 2, 3, 4])
            .range(["grey", "#2282FF", "#FAFF22", "#FFA922", "#FF3B22"])

        //Aux variables for first ever draw map
        checkFirstDrawMap = 0;

        //Aux variable for plot date
        let date;

        // Draw First Map
        internalMovementDataset(0)

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
                    internalMovementDataset(document.getElementById("myRange2D").value)
                    firstRedraw1 = 1;
                }
                else if (firstRedraw1 == 1) {
                    // Check slider
                    slider = document.getElementById("myRange2D");
                    slider.oninput = function () {
                        internalMovementDataset(this.value)
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
        function internalMovementDataset(dataSlider) {

            // Load external data and boot
            Promise.all([
                d3.json("../europe.geojson"),
                d3.csv("../../py/sanità/graph_2D/internal-movement-covid.csv").then(function (data) {

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
                    .domain([0, 1, 2, 3])
                    .range(["grey", "#2282FF", "#FAFF22", "#FF3B22"])

                map.clear()

                // Set the map 
                for (let i = 0; i < 37; i++) {

                    map.set(aux_var[i].Code, aux_var[i].restrictions_internal_movements)
                }
                date = aux_var[dataSlider].Day.toString()
                date = date.substr(0, 7)

                // Write date
                svg.selectAll('text.legend_2D').remove()
                //svg.selectAll('text.firstdate').remove()
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
                d3.selectAll('rect.legend2D').remove()
                d3.selectAll('text.legend2D').remove()

                // No data
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 100)
                    .attr("y", 780)
                    .attr('width', 200)
                    .attr('height', 15)
                    .style("fill", "grey")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 160)
                    .attr("y", 770)
                    .text("No data")
                    .style("font-size", "16px")
                    .attr("alignment-baseline", "middle")

                // First block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 400)
                    .attr("y", 780)
                    .attr('width', 300)
                    .attr('height', 15)
                    .style("fill", "#2282FF")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 495)
                    .attr("y", 770)
                    .text("No measures")
                    .style("font-size", "16px")
                    .attr("alignment-baseline", "middle")

                // Second block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 700)
                    .attr("y", 780)
                    .attr('width', 300)
                    .attr('height', 15)
                    .style("fill", "#FAFF22")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 720)
                    .attr("y", 770)
                    .text("Recommend movement restriction")
                    .style("font-size", "16px")
                    .attr("alignment-baseline", "middle")

                //Third block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 1000)
                    .attr("y", 780)
                    .attr('width', 300)
                    .attr('height', 15)
                    .style("fill", "#FF3B22")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 1070)
                    .attr("y", 770)
                    .text("Restrict movement")
                    .style("font-size", "16px")
                    .attr("alignment-baseline", "middle")
            })
        }

        //SECOND DATASET
        function testingDataset(dataSlider) {

            // Load external data and boot
            Promise.all([
                d3.json("../europe.geojson"),
                d3.csv("../../py/sanità/graph_2D/covid-19-testing-policy.csv").then(function (data) {

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

                    map.set(aux_var[i].Code, aux_var[i].testing_policy)
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

                // Set the color of each country
                svg.selectAll("path")
                    .data(topo.features)
                    .join("path")
                    .attr("fill", function (d) {
                        d.total = map.get(d.properties.iso_a3) || 0;
                        return colorScale(d.total);
                    })

                // LEGEND
                d3.selectAll('rect.legend2D').remove()
                d3.selectAll('text.legend2D').remove()

                // No data
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 100)
                    .attr("y", 780)
                    .attr('width', 150)
                    .attr('height', 15)
                    .style("fill", "grey")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 135)
                    .attr("y", 767)
                    .text("No data")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")

                // First block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 300)
                    .attr("y", 780)
                    .attr('width', 250)
                    .attr('height', 15)
                    .style("fill", "#2282FF")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 360)
                    .attr("y", 767)
                    .text("No testing policy")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")

                // Second block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 550)
                    .attr("y", 780)
                    .attr('width', 250)
                    .attr('height', 15)
                    .style("fill", "#FAFF22")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 580)
                    .attr("y", 767)
                    .text("Symptoms & key group")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")

                //Third block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 800)
                    .attr("y", 780)
                    .attr('width', 250)
                    .attr('height', 15)
                    .style("fill", "#FFA922")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 830)
                    .attr("y", 767)
                    .text("Anyone with symptoms")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")

                //Fourth block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 1050)
                    .attr("y", 780)
                    .attr('width', 250)
                    .attr('height', 15)
                    .style("fill", "#FF3B22")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 1100)
                    .attr("y", 767)
                    .text("Open public testing")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")
            })
        }

        function faceCoveringsDataset(dataSlider) {

            // Load external data and boot
            Promise.all([
                d3.json("../europe.geojson"),
                d3.csv("../../py/sanità/graph_2D/face-covering-policies-covid.csv").then(function (data) {
                    //Put data that i need in array based on date
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
                    .domain([0, 1, 2, 3, 4, 5])
                    .range(["grey", "#2282FF", "#FAFF22", "#FFA922", "#FF3B22", "#00ff1a"])

                map.clear()
                for (let i = 0; i < 37; i++) {

                    map.set(aux_var[i].Code, aux_var[i].facial_coverings)
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
                d3.selectAll('rect.legend2D').remove()
                d3.selectAll('text.legend2D').remove()

                // No data
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 70)
                    .attr("y", 780)
                    .attr('width', 150)
                    .attr('height', 15)
                    .style("fill", "grey")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 135)
                    .attr("y", 770)
                    .text("No data")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")

                // First block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 300)
                    .attr("y", 780)
                    .attr('width', 200)
                    .attr('height', 15)
                    .style("fill", "#2282FF")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 360)
                    .attr("y", 770)
                    .text("No policy")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")

                // Second block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 500)
                    .attr("y", 780)
                    .attr('width', 200)
                    .attr('height', 15)
                    .style("fill", "#FAFF22")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 550)
                    .attr("y", 770)
                    .text("Recommended")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")

                //Third block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 700)
                    .attr("y", 780)
                    .attr('width', 200)
                    .attr('height', 15)
                    .style("fill", "#FFA922")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 750)
                    .attr("y", 755)
                    .text("Required in ")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 730)
                    .attr("y", 770)
                    .text("some public spaces")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")

                //Fourth block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 900)
                    .attr("y", 780)
                    .attr('width', 200)
                    .attr('height', 15)
                    .style("fill", "#FF3B22")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 955)
                    .attr("y", 755)
                    .text("Required in")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 940)
                    .attr("y", 770)
                    .text("all public spaces")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")

                //Fifth block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", 1100)
                    .attr("y", 780)
                    .attr('width', 200)
                    .attr('height', 15)
                    .style("fill", "#00ff1a")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 1150)
                    .attr("y", 755)
                    .text("Required outside")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")
                svg.append("text").attr("class", "legend2D")
                    .attr("x", 1140)
                    .attr("y", 770)
                    .text("the home at all time")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")
            })
        }
    }
});





