$(document).ready(async function () {
    let aux = 0;
    let data_iniziale = 1;
    let movement = {}
    let testing = {}
    let faceMask = {}
    filterMovement()
    filterTesting()
    filterFacemask()

    setTimeout(function () {
        draw()
    }, 3000)


    addEventListener("resize", (event) => {
        data_iniziale = 1;
        draw()
    })


    function filterMovement() {
        d3.csv("../../py/sanità/graph_2D/internal-movement-covid.csv").then(function (data) {
            //Get only european country
            let inc1 = 0;
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
                    data[i].Code === "MNE" ||
                    data[i].Code === "ISL") {

                    movement[inc1] = data[i]
                    inc1++
                }
            }
        })
    }

    function filterTesting() {
        d3.csv("../../py/sanità/graph_2D/covid-19-testing-policy.csv").then(function (data) {
            //Get only european country
            let inc2 = 0;
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
                    data[i].Code === "MNE" ||
                    data[i].Code === "ISL") {

                    testing[inc2] = data[i]
                    inc2++
                }
            }
        })
    }

    function filterFacemask() {
        d3.csv("../../py/sanità/graph_2D/face-covering-policies-covid.csv").then(function (data) {
            //Get only european country
            let inc3 = 0;
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
                    data[i].Code === "MNE" ||
                    data[i].Code === "ISL") {

                    faceMask[inc3] = data[i]
                    inc3++
                }
            }
        })
    }


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
        let slider = document.querySelector("input[type='range']");
        slider.value = 0


        // Append the svg object to the body of the page
        const svg = d3.select("#graph_2D")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)
        console.log(clientWidth)
        svg.append("text")
            .attr("class", "data_iniziale")
            .attr("x", "13%")
            .attr("y", 230)
            .text("2020-01")
            .style("font-size", "40px")
            .attr("alignment-baseline", "middle")

        // Map and projection
        const path = d3.geoPath();
        const projection = d3.geoMercator()
            .scale(500)
            .center([20, 50])
            .translate([clientWidth / 1.79, clientHeight / 1.6]);

        // Data and color scale
        let map = new Map()
        /*const colorScale = d3.scaleThreshold()
            .domain([0, 1, 2, 3, 4])
            .range(["grey", "#08c0ff", "#ffa500", "#ff0831", "#FF3B22"])*/

        //Aux variables for first ever draw map
        checkFirstDrawMap = 0;

        //Aux variable for plot date
        let date;

        // Draw First Map
        // internalMovementDataset(0)

        /*if(aux_2==0){
            internalMovementDataset(0)
        }*/
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

            ]).then(function (loadData) {

                aux_var = {};
                temp2D = 0;
                for (i = 0; i < 40551; i++) {
                    {

                        // Get only datas on the selected date
                        if (movement[i].Day === "2020-0" + (Number(dataSlider) + 1).toString() + "-01" ||
                            movement[i].Day === "2020-" + (Number(dataSlider) + 1).toString() + "-01") {
                            aux_var[temp2D] = movement[i]
                            temp2D++
                        }
                    }
                }


                const colorScale = d3.scaleThreshold()
                    .domain([0, 1, 2, 3])
                    .range(["grey", "#65b5fd", "#ffbf29", "#ff3e6b"])

                map.clear()

                aux_var[37] = { Entity: "Montenegro", Code: "MNE", Day: "/", restrictions_internal_movements: -1 }
                aux_var[38] = { Entity: "Macedonia", Code: "MKD", Day: "/", restrictions_internal_movements: -1 }
                aux_var[39] = { Entity: "Kosovo", Code: "KSV", Day: "/", restrictions_internal_movements: -1 }

                // Set the map 
                for (let i = 0; i < 40; i++) {

                    map.set(aux_var[i].Code, aux_var[i].restrictions_internal_movements)
                }
                date = aux_var[dataSlider].Day.toString()
                date = date.substr(0, 7)

                if (data_iniziale == 0) {
                    d3.selectAll('text.data_iniziale').remove()

                }
                data_iniziale = 0
                // Write date
                svg.selectAll('text.legend_2D').remove()

                svg.append("text")
                    .attr("class", "legend_2D")
                    .attr("x", '13%')
                    .attr("y", 230)
                    .text(date)
                    .style("font-size", "40px")
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
                    .attr("x", "5%")
                    .attr("y", 570)
                    .attr('width', "15%")
                    .attr('height', 15)
                    .style("fill", "grey")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", '10%')
                    .attr("y", 560)
                    .text("No data")
                    .style("font-size", "16px")
                    .attr("alignment-baseline", "middle")

                // First block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", "25%")
                    .attr("y", 570)
                    .attr('width', "24.2%")
                    .attr('height', 15)
                    .style("fill", "#65b5fd")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", '33%')
                    .attr("y", 560)
                    .text("No measures")
                    .style("font-size", "16px")
                    .attr("alignment-baseline", "middle")

                // Second block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", "49.2%")
                    .attr("y", 570)
                    .attr('width', '24.2%')
                    .attr('height', 15)
                    .style("fill", "#ffbf29")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", '56.5%')
                    .attr("y", 545)
                    .text("Recommend ")
                    .style("font-size", "16px")
                    .attr("alignment-baseline", "middle")
                svg.append("text").attr("class", "legend2D")
                    .attr("x", '54%')
                    .attr("y", 560)
                    .text("movement restriction")
                    .style("font-size", "16px")
                    .attr("alignment-baseline", "middle")

                //Third block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", "73.4%")
                    .attr("y", 570)
                    .attr('width', '24.2%')
                    .attr('height', 15)
                    .style("fill", "#ff3e6b")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", "80%")
                    .attr("y", 560)
                    .text("Restrict movement")
                    .style("font-size", "16px")
                    .attr("alignment-baseline", "middle")
            })
        }

        //SECOND DATASET
        function testingDataset(dataSlider) {

            // Load external data and boot
            Promise.all([
                d3.json("../europe.geojson")
            ]).then(function (loadData) {

                aux_var = {};
                temp2D = 0;
                for (i = 0; i < 40551; i++) {
                    {
                        // Get only datas on the selected date
                        if (testing[i].Day === "2020-0" + (Number(dataSlider) + 1).toString() + "-01" ||
                            testing[i].Day === "2020-" + (Number(dataSlider) + 1).toString() + "-01") {
                            aux_var[temp2D] = testing[i]
                            temp2D++
                        }
                    }
                }

                const colorScale = d3.scaleThreshold()
                    .domain([0, 1, 2, 3, 4])
                    .range(["grey", "#65b5fd", "#fdfe73", "#ffbf29", "#ff3e6b"])

                aux_var[37] = { Entity: "Montenegro", Code: "MNE", Day: "/", testing_policy: "-1" }
                aux_var[38] = { Entity: "Macedonia", Code: "MKD", Day: "/", testing_policy: "-1" }
                aux_var[39] = { Entity: "Kosovo", Code: "KSV", Day: "/", testing_policy: "-1" }


                map.clear()
                for (let i = 0; i < 40; i++) {

                    map.set(aux_var[i].Code, aux_var[i].testing_policy)
                }
                date = aux_var[dataSlider].Day
                date = date.substr(0, 7)


                // Write date
                d3.selectAll('text.legend_2D').remove()
                d3.selectAll('text.data_iniziale').remove()
                svg.append("text")
                    .attr("class", "legend_2D")
                    .attr("x", '13%')
                    .attr("y", 230)
                    .text(date)
                    .style("font-size", "40px")
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
                    .attr("x", "3%")
                    .attr("y", 570)
                    .attr('width', "13%")
                    .attr('height', 15)
                    .style("fill", "grey")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", "7%")
                    .attr("y", 560)
                    .text("No data")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")

                // First block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", "20%")
                    .attr("y", 570)
                    .attr('width', "19%")
                    .attr('height', 15)
                    .style("fill", "#65b5fd")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", "25%")
                    .attr("y", 560)
                    .text("No testing policy")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")

                // Second block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", "39%")
                    .attr("y", 570)
                    .attr('width', '19%')
                    .attr('height', 15)
                    .style("fill", "#fdfe73")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", "41%")
                    .attr("y", 560)
                    .text("Symptoms & key group")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")

                //Third block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", "58%")
                    .attr("y", 570)
                    .attr('width', '19%')
                    .attr('height', 15)
                    .style("fill", "#ffbf29")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", "60.5%")
                    .attr("y", 560)
                    .text("Anyone with symptoms")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")

                //Fourth block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", "77%")
                    .attr("y", 570)
                    .attr('width', '19%')
                    .attr('height', 15)
                    .style("fill", "#ff3e6b")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", "81%")
                    .attr("y", 560)
                    .text("Open public testing")
                    .style("font-size", "18px")
                    .attr("alignment-baseline", "middle")
            })
        }

        function faceCoveringsDataset(dataSlider) {

            // Load external data and boot
            Promise.all([
                d3.json("../europe.geojson"),
            ]).then(function (loadData) {

                aux_var = {};
                temp2D = 0;
                for (i = 0; i < 40551; i++) {
                    {
                        if (faceMask[i].Day === "2020-0" + (Number(dataSlider) + 1).toString() + "-01" ||
                            faceMask[i].Day === "2020-" + (Number(dataSlider) + 1).toString() + "-01") {
                            aux_var[temp2D] = faceMask[i]
                            temp2D++
                        }
                    }
                }
                console.log(faceMask)

                const colorScale = d3.scaleThreshold()
                    .domain([0, 1, 2, 3, 4, 5])
                    .range(["grey", "#65b5fd", "#fdfe73", "#ffbf29", "#ff3e6b", "#a30192"])

                aux_var[37] = { Entity: "Montenegro", Code: "MNE", Day: "/", facial_coverings: -1 }
                aux_var[38] = { Entity: "Macedonia", Code: "MKD", Day: "/", facial_coverings: -1 }
                aux_var[39] = { Entity: "Kosovo", Code: "KSV", Day: "/", facial_coverings: -1 }


                map.clear()
                for (let i = 0; i < 40; i++) {

                    map.set(aux_var[i].Code, aux_var[i].facial_coverings)
                }
                date = aux_var[dataSlider].Day
                date = date.substr(0, 7)

                // Write date
                d3.selectAll('text.legend_2D').remove()
                d3.selectAll('text.data_iniziale').remove()
                svg.append("text")
                    .attr("class", "legend_2D")
                    .attr("x", '13%')
                    .attr("y", 230)
                    .text(date)
                    .style("font-size", "40px")
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
                    .attr("x", "4%")
                    .attr("y", 570)
                    .attr('width', "10%")
                    .attr('height', 15)
                    .style("fill", "grey")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", "7%")
                    .attr("y", 560)
                    .text("No data")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")

                // First block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", "20%")
                    .attr("y", 570)
                    .attr('width', "15%")
                    .attr('height', 15)
                    .style("fill", "#65b5fd")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", "25%")
                    .attr("y", 560)
                    .text("No policy")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")

                // Second block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", '35%')
                    .attr("y", 570)
                    .attr('width', "15%")
                    .attr('height', 15)
                    .style("fill", "#fdfe73")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", "38%")
                    .attr("y", 560)
                    .text("Recommended")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")

                //Third block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", '50%')
                    .attr("y", 570)
                    .attr('width', "15%")
                    .attr('height', 15)
                    .style("fill", "#ffbf29")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", "55%")
                    .attr("y", 547)
                    .text("Required in ")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")
                svg.append("text").attr("class", "legend2D")
                    .attr("x", '53%')
                    .attr("y", 560)
                    .text("some public spaces")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")

                //Fourth block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", '65%')
                    .attr("y", 570)
                    .attr('width', "15%")
                    .attr('height', 15)
                    .style("fill", "#ff3e6b")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", '70%')
                    .attr("y", 547)
                    .text("Required in")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")
                svg.append("text").attr("class", "legend2D")
                    .attr("x", '69%')
                    .attr("y", 560)
                    .text("all public spaces")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")

                //Fifth block
                svg.append("rect").attr("class", "legend2D")
                    .attr("x", '80%')
                    .attr("y", 570)
                    .attr('width', "15%")
                    .attr('height', 15)
                    .style("fill", "#a30192")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend2D")
                    .attr("x", '83%')
                    .attr("y", 547)
                    .text("Required outside")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")
                svg.append("text").attr("class", "legend2D")
                    .attr("x", '82%')
                    .attr("y", 560)
                    .text("the home at all time")
                    .style("font-size", "14px")
                    .attr("alignment-baseline", "middle")
            })
        }
    }


});





