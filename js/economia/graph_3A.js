$(document).ready(function () {

    // MODIFICA: MANCA TOOLTIP

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 20, bottom: 30, left: 50 },
        width = 1500 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#graph_3A")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    // Parse the Data
    d3.csv("../../csv/economia/graph_3A.csv").then(function (data) {

        // List of subgroups = header of the csv files = soil condition here
        const subgroups = data.columns.slice(1)


        // List of groups = species here = value of the first column called group -> I show them on the X axis
        const groups = data.map(d => d.country)


        let high = d3.select("#graph_3A")
            .append("div")
            .attr("class", "Tooltip")
            .attr('style', 'position: absolute; opacity: 0;')
            .style("opacity", 0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        const tooltip = d3.select("#graph_3A")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px")


        // Add X axis
        const x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.3])
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .style("font-size", "18px")
            .call(d3.axisBottom(x).tickSize(10));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, 40])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y))
        //.style("font-size", "18px")

        // Another scale for subgroup position?
        const xSubgroup = d3.scaleBand()
            .domain(subgroups)
            .range([0, x.bandwidth()])
            .padding([0.05])

        // Color palette = one color per subgroup
        const color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#e41a1c', '#377eb8', '#4daf4a'])



        const mouseover = function (event, d) {

            // Memorizza la data evidenziata
            let date = d3.select(this).datum().key;

            // Funziona che evidenziano le barre in base all'anno
            if (date == "2019") {

                bar = 0; // Va incrementata per ogni nuova barra in ogni gruppo

                //Imposto tutte le barre a opacità 0
                for (let h = 0; h < i; h++) {
                    d3.select(".bar" + h).style("opacity", 0.2)
                }

                //Imposto le barre che mi interessano a opacità 1
                d3.select(".bar" + bar).style("opacity", 1)
                d3.select(".bar" + (bar + 3 * 1)).style("opacity", 1)
                d3.select(".bar" + (bar + 3 * 2)).style("opacity", 1)
                d3.select(".bar" + (bar + 3 * 3)).style("opacity", 1)
                d3.select(".bar" + (bar + 3 * 4)).style("opacity", 1)
            }

            if (date == "2020") {

                bar = 1;

                for (let h = 0; h < i; h++) {
                    d3.select(".bar" + h).style("opacity", 0.2)
                }

                d3.select(".bar" + bar).style("opacity", 1)
                d3.select(".bar" + (bar + 3 * 1)).style("opacity", 1)
                d3.select(".bar" + (bar + 3 * 2)).style("opacity", 1)
                d3.select(".bar" + (bar + 3 * 3)).style("opacity", 1)
                d3.select(".bar" + (bar + 3 * 4)).style("opacity", 1)
            }

            if (date == "2021") {

                bar = 2;

                for (let h = 0; h < i; h++) {
                    d3.select(".bar" + h).style("opacity", 0.2)
                }

                d3.select(".bar" + bar).style("opacity", 1)
                d3.select(".bar" + (bar + 3 * 1)).style("opacity", 1)
                d3.select(".bar" + (bar + 3 * 2)).style("opacity", 1)
                d3.select(".bar" + (bar + 3 * 3)).style("opacity", 1)
                d3.select(".bar" + (bar + 3 * 4)).style("opacity", 1)
            }
        }

        const mousemove = function (event, d) {

            // FARE

        }

        const mouseleave = function (event, d) {

            // Riporto tutte le barre alla stessa opacità
            d3.selectAll("rect")
                .style("opacity", 1)
        }

        // Variabile ausiliaria per la denominazione dei rect
        i = 0;

        svg.append("g")
            .selectAll("g")
            // Enter in data = loop group per group
            .data(data)
            .join("g")
            .attr("transform", d => `translate(${x(d.country)}, 0)`)
            .selectAll("rect")
            .data(function (d) { return subgroups.map(function (key) { return { key: key, value: d[key] }; }); })
            .join("rect")
            .attr("class", function (d) { return ("bar" + i++) })
            .attr("x", d => xSubgroup(d.key))
            .attr("y", d => y(d.value))
            .attr("width", xSubgroup.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", d => color(d.key))
            .on("mouseover", mouseover)
            // .on("mousemove", mousemove) DA FARE
            .on("mouseleave", mouseleave)
    })
})




