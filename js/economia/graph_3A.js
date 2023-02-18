$(document).ready(function () {

    let aux = 0;
    draw()
    addEventListener("resize", (event) => {
        draw()
    })

    function draw() {

        let clientHeight = document.getElementById('graph_3A').clientHeight - 100;
        let clientWidth = document.getElementById('graph_3A').clientWidth - 100;

        // set the dimensions and margins of the graph
        const margin = { top: 10, right: 20, bottom: 60, left: 70 };
        if (aux == 1) {
            $("#graph_3A").empty();
        }
        aux = 1;

        // Append the svg object to the body of the page
        const svg = d3.select("#graph_3A")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        let arrayData = []

        // Parse the Data
        d3.csv("../../csv/economia/graph_3A.csv").then(function (data) {
            arrayData[0] = { "2017": data[0].OBS_VALUE, "2018": data[1].OBS_VALUE, "2019": data[2].OBS_VALUE, "2020": data[3].OBS_VALUE, "2021": data[4].OBS_VALUE, country: "Germany" }
            arrayData[1] = { "2017": data[5].OBS_VALUE, "2018": data[6].OBS_VALUE, "2019": data[7].OBS_VALUE, "2020": data[8].OBS_VALUE, "2021": data[9].OBS_VALUE, country: "Spain" }
            arrayData[2] = { "2017": data[10].OBS_VALUE, "2018": data[11].OBS_VALUE, "2019": data[12].OBS_VALUE, "2020": data[13].OBS_VALUE, "2021": data[14].OBS_VALUE, country: "France" }
            arrayData[3] = { "2017": data[15].OBS_VALUE, "2018": data[16].OBS_VALUE, "2019": data[17].OBS_VALUE, "2020": data[18].OBS_VALUE, "2021": data[19].OBS_VALUE, country: "Italy" }
            arrayData["columns"] = ["country", "2017", "2018", "2019", "2020", "2021"]

            const subgroups = arrayData.columns.slice(1)

            // List of groups = species here = value of the first column called group -> I show them on the X axis
            const groups = arrayData.map(d => d.country)

            if (clientWidth < 1547) {
                svg.append("text")
                    .attr("class", "legend1B")
                    .attr("x", "-30")
                    .attr("y", 190)
                    .text("Export unit index (2015=100)")
                    .style("font-size", "90%")
                    .attr('transform', 'rotate(270 ' + 10 + ' ' + 240 + ')')
                    .attr("alignment-baseline", "middle")
            }
            else {
                svg.append("text")
                    .attr("class", "legend1B")
                    .attr("x", "-60")
                    .attr("y", 190)
                    .text("Export volume index (2015=100)")
                    .style("font-size", "100%")
                    .attr('transform', 'rotate(270 ' + 10 + ' ' + 240 + ')')
                    .attr("alignment-baseline", "middle")
            }

            // Add X axis
            const x = d3.scaleBand()
                .domain(groups)
                .range([0, clientWidth])
                .padding([0.3])
            svg.append("g")
                .attr("transform", `translate(0, ${clientHeight})`)
                .style("font-size", "18px")
                .call(d3.axisBottom(x).tickSize(10));

            // Add Y axis
            const y = d3.scaleLinear()
                .domain([80, 110])
                .range([clientHeight, 0]);
            svg.append("g")
                .call(d3.axisLeft(y))

            // Another scale for subgroup position?
            const xSubgroup = d3.scaleBand()
                .domain(subgroups)
                .range([0, x.bandwidth()])
                .padding([0.05])

            // Color palette = one color per subgroup
            const color = d3.scaleOrdinal()
                .domain(subgroups)
                .range(["#46d366", "#ff3e6b", "#ffbf29", "#00d6ff", "#a862ea"]);

            const mouseover = function (event, d) {

                // Memorizza la data evidenziata
                let date = d3.select(this).datum().key;
                if (date == "2017") {

                    bar = 0; // Va incrementata per ogni nuova barra in ogni gruppo

                    //Imposto tutte le barre a opacità 0
                    for (let h = 0; h < 20; h++) {
                        d3.select(".bar" + h).style("opacity", 0.2)
                    }

                    //Imposto le barre che mi interessano a opacità 1
                    d3.select(".bar" + bar).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 1)).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 2)).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 3)).style("opacity", 1)

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '8.2%')
                        .attr("y", 60)
                        .text(arrayData[0][2017])
                        .style("font-size", '1vi')
                        .attr("alignment-baseline", "middle")

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '29.5%')
                        .attr("y", 30)
                        .text(arrayData[1][2017])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '51.2%')
                        .attr("y", 90)
                        .text(arrayData[2][2017])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '72.7%')
                        .attr("y", 25)
                        .text(arrayData[3][2017])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")
                }

                if (date == "2018") {

                    bar = 1; // Va incrementata per ogni nuova barra in ogni gruppo

                    //Imposto tutte le barre a opacità 0
                    for (let h = 0; h < 20; h++) {
                        d3.select(".bar" + h).style("opacity", 0.2)
                    }

                    //Imposto le barre che mi interessano a opacità 1
                    d3.select(".bar" + bar).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 1)).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 2)).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 3)).style("opacity", 1)

                    //LEGEND
                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '11.3%')
                        .attr("y", 50)
                        .text(arrayData[0][2018])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")
                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '33%')
                        .attr("y", 20)
                        .text(arrayData[1][2018])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")
                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '54.3%')
                        .attr("y", 75)
                        .text(arrayData[2][2018])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")
                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '76%')
                        .attr("y", 30)
                        .text(arrayData[3][2018])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")
                }

                // Funziona che evidenziano le barre in base all'anno
                if (date == "2019") {

                    bar = 2; // Va incrementata per ogni nuova barra in ogni gruppo

                    //Imposto tutte le barre a opacità 0
                    for (let h = 0; h < 20; h++) {
                        d3.select(".bar" + h).style("opacity", 0.2)
                    }

                    //Imposto le barre che mi interessano a opacità 1
                    d3.select(".bar" + bar).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 1)).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 2)).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 3)).style("opacity", 1)

                    //LEGEND
                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", "14.2%")
                        .attr("y", 90)
                        .text(arrayData[0][2019])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '36%')
                        .attr("y", 15)
                        .text(arrayData[1][2019])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '57.3%')
                        .attr("y", 68)
                        .text(arrayData[2][2019])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '79%')
                        .attr("y", 30.5)
                        .text(arrayData[3][2019])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")
                }

                if (date == "2020") {

                    bar = 3;

                    for (let h = 0; h < 20; h++) {
                        d3.select(".bar" + h).style("opacity", 0.2)
                    }

                    d3.select(".bar" + bar).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 1)).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 2)).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 3)).style("opacity", 1)

                    //LEGEND
                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", "16.9%")
                        .attr("y", 208)
                        .text(arrayData[0][2020])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")
                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '38.4%')
                        .attr("y", 150)
                        .text(arrayData[1][2020])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '60.1%')
                        .attr("y", 275)
                        .text(arrayData[2][2020])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '82%')
                        .attr("y", 155)
                        .text(arrayData[3][2020])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")
                }

                if (date == "2021") {

                    bar = 4;

                    for (let h = 0; h < 20; h++) {
                        d3.select(".bar" + h).style("opacity", 0.2)
                    }

                    d3.select(".bar" + bar).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 1)).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 2)).style("opacity", 1)
                    d3.select(".bar" + (bar + 5 * 3)).style("opacity", 1)

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", "20.1%")
                        .attr("y", 125)
                        .text(arrayData[0][2021])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '41.7%')
                        .attr("y", 40)
                        .text(arrayData[1][2021])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '63.3%')
                        .attr("y", 190)
                        .text(arrayData[2][2021])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")

                    svg.append("text")
                        .attr("class", "label_2A")
                        .attr("text-anchor", "middle")
                        .attr("x", '85%')
                        .attr("y", 30)
                        .text(arrayData[3][2021])
                        .style("font-size", "1vi")
                        .attr("alignment-baseline", "middle")
                }
            }

            const mouseleave = function (event, d) {
                // Riporto tutte le barre alla stessa opacità
                d3.selectAll("rect")
                    .style("opacity", 1)
                svg.selectAll('text.label_2A').remove()
            }

            // Variabile ausiliaria per la denominazione dei rect
            i = 0;

            svg.append("g")
                .selectAll("g")
                // Enter in data = loop group per group
                .data(arrayData)
                .join("g")
                .attr("transform", d => `translate(${x(d.country)}, 0)`)
                .selectAll("rect")
                .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
                .join("rect")
                .attr("class", function (d) { return ("bar" + i++) })
                .attr("x", d => xSubgroup(d.key))
                .attr("y", d => y(d.value))
                .attr("width", xSubgroup.bandwidth())
                .attr("height", d => clientHeight - y(d.value))
                .attr("fill", d => color(d.key))
                .on("mouseover", mouseover)
                // .on("mousemove", mousemove) DA FARE
                .on("mouseleave", mouseleave)
        })

        //Legend
        svg.append("rect").attr("class", "legend4B")
            .attr("x", "9%")
            .attr("y", 395)
            .attr('width', '5%')
            .attr('height', 7)
            .style("fill", "#46d366")
        svg.append("text").attr("class", "legend4B")
            .attr("x", "15%")
            .attr("y", 400)
            .text("2017")
            .style("font-size", "1vi")
            .attr("alignment-baseline", "middle")

        //Legend
        svg.append("rect").attr("class", "legend4B")
            .attr("x", "24%")
            .attr("y", 395)
            .attr('width', '5%')
            .attr('height', 7)
            .style("fill", "#ff3e6b")
        svg.append("text").attr("class", "legend4B")
            .attr("x", "30%")
            .attr("y", 400)
            .text("2018")
            .style("font-size", "1vi")
            .attr("alignment-baseline", "middle")

        //Legend
        svg.append("rect").attr("class", "legend4B")
            .attr("x", "39%")
            .attr("y", 395)
            .attr('width', '5%')
            .attr('height', 7)
            .style("fill", "#ffbf29")
        svg.append("text").attr("class", "legend4B")
            .attr("x", "45%")
            .attr("y", 400)
            .text("2019")
            .style("font-size", "1vi")
            .attr("alignment-baseline", "middle")

        svg.append("rect").attr("class", "legend4B")
            .attr("x", "54%")
            .attr("y", 395)
            .attr('width', '5%')
            .attr('height', 7)
            .style("fill", "#00d6ff")
        svg.append("text").attr("class", "legend4B")
            .attr("x", "60%")
            .attr("y", 400)
            .text("2020")
            .style("font-size", "1vi")
            .attr("alignment-baseline", "middle")

        svg.append("rect").attr("class", "legend4B")
            .attr("x", "69%")
            .attr("y", 395)
            .attr('width', '5%')
            .attr('height', 7)
            .style("fill", "#a862ea")
        svg.append("text").attr("class", "legend4B")
            .attr("x", "75%")
            .attr("y", 400)
            .text("2021")
            .style("font-size", "1vi")
            .attr("alignment-baseline", "middle")
    }
})




