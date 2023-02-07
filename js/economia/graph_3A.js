$(document).ready(function () {

    // MODIFICA: MANCA TOOLTIP

    //LINK: https://ec.europa.eu/eurostat/databrowser/view/TET00001/default/table?lang=en&category=ext_go.ext_go_agg.ext_go_lti.ext_go_lti_int
    //UNITA DI MISURA:
    /*Volume index = value index / unit-value index Value index: The value index is 
    calculated as the percentage change between the trade value of the current month
     and the average monthly trade value of the previous year. Unit-value index: 
     Monthly raw data are processed at the most detailed level in order to calculate
      elementary unit-values defined by trade value/quantity. These unit-values are 
      divided by the average unit-value of the previous year to obtain elementary 
      unit-value indices, from which outliers are detected and removed. Elementary 
      unit-value indices are then aggregated over countries and commodities, by 
      using the Laspeyres, Paasche and Fisher formulae. Finally, the Fisher unit-value 
      indices are chained back to the reference year (2015 = 100).*/


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

    let arrayData = []
    // Parse the Data
    d3.csv("../../py/economia/graph_3A/tet00001__custom_4855850_linear.csv").then(function (data) {

        //"../../py/economia/graph_3A/tet00001__custom_4855850_linear.csv"
        //console.log(data)
        // List of subgroups = header of the csv files = soil condition here

        // arrProv = { data: ["cazzo", "culo"] }

        arrayData[0] = { "2017": data[0].OBS_VALUE, "2018": data[1].OBS_VALUE, "2019": data[2].OBS_VALUE, "2020": data[3].OBS_VALUE, "2021": data[4].OBS_VALUE, country: "Germany" }
        arrayData[1] = { "2017": data[5].OBS_VALUE, "2018": data[6].OBS_VALUE, "2019": data[7].OBS_VALUE, "2020": data[8].OBS_VALUE, "2021": data[9].OBS_VALUE, country: "Spain" }
        arrayData[2] = { "2017": data[10].OBS_VALUE, "2018": data[11].OBS_VALUE, "2019": data[12].OBS_VALUE, "2020": data[13].OBS_VALUE, "2021": data[14].OBS_VALUE, country: "France" }
        arrayData[3] = { "2017": data[15].OBS_VALUE, "2018": data[16].OBS_VALUE, "2019": data[17].OBS_VALUE, "2020": data[18].OBS_VALUE, "2021": data[19].OBS_VALUE, country: "Italy" }
        arrayData["columns"] = ["country", "2017", "2018", "2019", "2020", "2021"]
        console.log(arrayData)

        const subgroups = arrayData.columns.slice(1)
        console.log(subgroups)
        // List of groups = species here = value of the first column called group -> I show them on the X axis
        const groups = arrayData.map(d => d.country)
        console.log(groups)



        /*let high = d3.select("#graph_3A")
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
            .style("padding", "10px")*/


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
            .domain([80, 110])
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
            .range(['#EF5350', '#AB47BC', '#FFCA28', '#29B6F6', '#66BB6A'])



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
            .attr("height", d => height - y(d.value))
            .attr("fill", d => color(d.key))
            .on("mouseover", mouseover)
            // .on("mousemove", mousemove) DA FARE
            .on("mouseleave", mouseleave)
    })
})




