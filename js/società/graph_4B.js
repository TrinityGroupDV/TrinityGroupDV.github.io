$(document).ready(async function () {
    //TODO: sistemare data, colori

    let aux = 0;
    let restriction = {}
    filterFacemask()
    setTimeout(function () {
        draw()
    }, 3000)

    addEventListener("resize", (event) => {
        draw()
    })
    function filterFacemask() {
        d3.csv("../../py/sanità/graph_2D/stay-at-home-covid.csv").then(function (data) {
            //Get only european country
            let inc = 0;
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

                    restriction[inc] = data[i]
                    inc++
                }
            }
        })
    }

    function draw() {

        let clientHeight = document.getElementById('graph_4B').clientHeight - 90;
        let clientWidth = document.getElementById('graph_4B').clientWidth - 140;


        // Set margin
        const margin = { top: 10, right: 30, bottom: 50, left: 80 }
        if (aux == 1) {
            $("#graph_4B").empty();
        }
        aux = 1;
        // Append the svg object to the body of the page
        const svg = d3.select("#graph_4B")
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
            ]).then(function (loadData) {
                aux_var = {};
                temp2D = 0;
                for (i = 0; i < 40551; i++) {
                    {

                        // Get only datas on the selected date
                        if (restriction[i].Day === "2020-0" + (Number(dataSlider) + 1).toString() + "-01" ||
                            restriction[i].Day === "2020-" + (Number(dataSlider) + 1).toString() + "-01") {
                            aux_var[temp2D] = restriction[i]
                            temp2D++
                        }
                    }
                }

                const colorScale = d3.scaleThreshold()
                    .domain([0, 1, 2, 3, 4])
                    .range(["grey", "#65b5fd", "#fdfe73", "#ffbf29", "#ff3e6b"])

                aux_var[37] = { Entity: "Montenegro", Code: "MNE", Day: "/", stay_home_requirements: -1 }
                aux_var[38] = { Entity: "Macedonia", Code: "MKD", Day: "/", stay_home_requirements: -1 }
                aux_var[39] = { Entity: "Kosovo", Code: "KSV", Day: "/", stay_home_requirements: -1 }

                map.clear()



                for (let i = 0; i < 40; i++) {

                    map.set(aux_var[i].Code, aux_var[i].stay_home_requirements)
                }
                date = aux_var[dataSlider].Day
                date = date.substr(0, 7)

                // Write date
                d3.selectAll('text.legend_2D').remove()
                svg.append("text")
                    .attr("class", "legend_2D")
                    .attr("x", '5%')
                    .attr("y", 230)
                    .text(date)
                    .style("font-size", "40px")
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


                svg.selectAll('text.legend4B').remove()
                svg.selectAll('rect.legend4B').remove()

                // No data
                svg.append("rect").attr("class", "legend4B")
                    .attr("x", "3%")
                    .attr("y", 550)
                    .attr('width', "13%")
                    .attr('height', 15)
                    .style("fill", "grey")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend4B")
                    .attr("x", "7%")
                    .attr("y", 540)
                    .text("No data")
                    .style("font-size", "1.2vi")
                    .attr("alignment-baseline", "middle")

                // First block
                svg.append("rect").attr("class", "legend4B")
                    .attr("x", "20%")
                    .attr("y", 550)
                    .attr('width', "19%")
                    .attr('height', 15)
                    .style("fill", "#65b5fd")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend4B")
                    .attr("x", "25%")
                    .attr("y", 540)
                    .text("No measure")
                    .style("font-size", "1.2vi")
                    .attr("alignment-baseline", "middle")

                // Second block
                svg.append("rect").attr("class", "legend4B")
                    .attr("x", "39%")
                    .attr("y", 550)
                    .attr('width', '19%')
                    .attr('height', 15)
                    .style("fill", "#fdfe73")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend4B")
                    .attr("x", "43%")
                    .attr("y", 540)
                    .text("Recommended")
                    .style("font-size", "1.2vi")
                    .attr("alignment-baseline", "middle")

                //Third block
                svg.append("rect").attr("class", "legend4B")
                    .attr("x", "58%")
                    .attr("y", 550)
                    .attr('width', '19%')
                    .attr('height', 15)
                    .style("fill", "#ffbf29")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend4B")
                    .attr("x", "58%")
                    .attr("y", 540)
                    .text("Required (except essentials)")
                    .style("font-size", "1.2vi")
                    .attr("alignment-baseline", "middle")

                //Fourth block
                svg.append("rect").attr("class", "legend4B")
                    .attr("x", "77%")
                    .attr("y", 550)
                    .attr('width', '19%')
                    .attr('height', 15)
                    .style("fill", "#ff3e6b")
                    .attr('stroke', 'grey')
                svg.append("text").attr("class", "legend4B")
                    .attr("x", "78%")
                    .attr("y", 540)
                    .text("Required (few exceptions)")
                    .style("font-size", "1.2vi")
                    .attr("alignment-baseline", "middle")


            })

        }
    }
})






