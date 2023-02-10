$(document).ready(function () {
    //TODO: sistemare bottoni, unità di misura, colori

    //LINK: https://ec.europa.eu/eurostat/databrowser/view/STS_SEPR_M__custom_4855705/default/table?lang=en
    //UNITA DI MISURA: Volume index of production (vedi graph 3A)

    //FINITO

    let aux = 0;
    draw()
    addEventListener("resize", (event) => {
        draw()
    })
    function draw() {

        let clientHeight = document.getElementById('graph_3C').clientHeight;
        let clientWidth = document.getElementById('graph_3C').clientWidth - 10;

        // set the dimensions and margins of the graph
        const margin = 40;
        if (aux == 1) {
            $("#graph_3C").empty();
        }
        aux = 1;
        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        const radius = Math.min(clientWidth, clientHeight) / 2 - margin;

        // append the svg object to the div called 'my_dataviz'
        const svg = d3.select("#graph_3C")
            .append("svg")
            .attr("width", clientWidth)
            .attr("height", clientHeight)
            .append("g")
            .attr("transform", `translate(${clientWidth / 2}, ${clientHeight / 2})`);

        d3.csv("../../csv/economia/graph_3C.csv").then(function (data) {

            // console.log(data[10].nace_r2 + " " + data[10].TIME_PERIOD)

            let sum1 = Number(data[0].OBS_VALUE) + Number(data[6].OBS_VALUE) + Number(data[8].OBS_VALUE) + Number(data[4].OBS_VALUE) + Number(data[2].OBS_VALUE)
            let sum2 = Number(data[1].OBS_VALUE) + Number(data[7].OBS_VALUE) + Number(data[9].OBS_VALUE) + Number(data[5].OBS_VALUE) + Number(data[3].OBS_VALUE)

            data1 = { Accomodation: (Number(data[0].OBS_VALUE) * 100 / sum1).toFixed(1), Real_estate: (Number(data[6].OBS_VALUE) * 100 / sum1).toFixed(1), Travel_agency: (Number(data[8].OBS_VALUE) * 100 / sum1).toFixed(1), Telecommunications: (Number(data[4].OBS_VALUE) * 100 / sum1).toFixed(1), Ict: (Number(data[2].OBS_VALUE) * 100 / sum1).toFixed(1) }
            data2 = { Accomodation: (Number(data[1].OBS_VALUE) * 100 / sum2).toFixed(1), Real_estate: (Number(data[7].OBS_VALUE) * 100 / sum2).toFixed(1), Travel_agency: (Number(data[9].OBS_VALUE) * 100 / sum2).toFixed(1), Telecommunications: (Number(data[5].OBS_VALUE) * 100 / sum2).toFixed(1), Ict: (Number(data[3].OBS_VALUE) * 100 / sum2).toFixed(1) }


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
                    d3.select('text.legend3C').remove()
                    svg.append("text")
                        .attr("x", -40)
                        .attr("y", -200)
                        .text("May 2020")
                        .style("font-size", "17px")
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
                    .text(function (d) {
                        return d.data[0].replaceAll('_', ' ') + ': ' + d.data[1] + "%"
                    })
                    .style("font-size", "14px")
                    .attr("x", 0)
                    .attr("transform", function (d) { return `translate(${arcGenerator.centroid(d)})` })
                    .style("text-anchor", "middle")


                svg.append("text")
                    .attr("class", "legend3C")
                    .attr("x", -40)
                    .attr("y", -200)
                    .text("May 2019")
                    .style("font-size", "17px")


            }

            // Initialize the plot with the first dataset
            update(data1)
        })
    }
})




