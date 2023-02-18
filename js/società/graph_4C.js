$(document).ready(function () {

    let aux = 0;
    draw()
    addEventListener("resize", (event) => {
        draw()
    })

    function draw() {
        let clientHeight = document.getElementById('graph_4C').clientHeight - 100;
        let clientWidth = document.getElementById('graph_4C').clientWidth - 100;

        // set the dimensions and margins of the graph
        const margin = { top: 30, right: 20, bottom: 40, left: 65 };
        if (aux == 1) {
            $("#graph_4C").empty();
        }
        aux = 1;

        // append the svg object to the body of the page
        const svg = d3.select("#graph_4C")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)


        // Parse the Data
        // d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv")
        d3.csv("../../csv/società/graph_4C.csv")
            .then(function (data) {

                //console.log(data)
                let values = new Array();
                let column = ["year", "state", "age", "value"];
                for (var i = 0; i < data.length; i++) {
                    values[i] = {};
                    values[i][column[0]] = data[i]["TIME_PERIOD"];
                    values[i][column[1]] = data[i]["geo"];
                    values[i][column[2]] = data[i]["age"];
                    values[i][column[3]] = data[i]["OBS_VALUE"];
                }

                console.log(values)

                const dataByYear = values.reduce((accumulator, currentValue) => {
                    const { year, ...rest } = currentValue;
                    if (!accumulator[year]) {
                        accumulator[year] = [];
                    }
                    accumulator[year].push(rest);
                    return accumulator;
                }, {});

                let acc = 0;
                let array_2019 = []
                console.log(dataByYear[2019][0].state);
                for (i = 0; i < 24; i++) {
                    if (dataByYear[2019][i].state == "DE") {
                        array_2019[acc] = dataByYear[2019][i]
                        acc++
                    }
                }
                for (i = 0; i < 24; i++) {
                    if (dataByYear[2019][i].state == "FR") {
                        array_2019[acc] = dataByYear[2019][i]
                        acc++
                    }
                }
                for (i = 0; i < 24; i++) {
                    if (dataByYear[2019][i].state == "ES") {
                        array_2019[acc] = dataByYear[2019][i]
                        acc++
                    }
                }
                for (i = 0; i < 24; i++) {
                    if (dataByYear[2019][i].state == "IT") {
                        array_2019[acc] = dataByYear[2019][i]
                        acc++
                    }
                }
                /*let array = []
                console.log(array_2019)
                for (let i = 0; i < 1; i++) {
                    array[0] = {
                        "state": array_2019[i].state,
                        "Y18-24": array_2019[i].value,
                        "Y25-49": array_2019[i + 1].value,
                        "Y50-64": array_2019[i + 2].value,
                        "Y65-74": array_2019[i + 3].value,
                        "Y_GE75": array_2019[i + 4].value,
                        "Y_LT18": array_2019[i + 5].value
                    }
                    i=i+5

                }*/
                console.log(array_2019)
                let array19 = [];
                for (let j = 0; j < 4; j++) {
                    switch (j) {
                        case 0:
                            array19[j] = { state: 'Germany' };
                            break;
                        case 1:
                            array19[j] = { state: 'France' };
                            break;
                        case 2:
                            array19[j] = { state: 'Spain' };
                            break;
                        case 3:
                            array19[j] = { state: 'Italy' };
                            break;
                    }
                    for (let i = 0; i < array_2019.length/4; i++) {
                        array19[j][array_2019[i+(j*6)].age] = array_2019[i+(j*6)].value;
                    }
                }
                console.log(array_2019)
                console.log(array19)
            })
    }












    // List of subgroups = header of the csv files = soil condition here
    // const subgroups = column;
    const subgroups = data.columns.slice(1)

    // List of groups = species here = value of the first column called group -> I show them on the X axis
    const groups = values.map(d => (d.year))


    // Add X axis
    const x = d3.scaleLinear()
        .domain([60, 0])
        .range([clientWidth, 0])
    svg.append("g")
        .attr("transform", `translate(0, ${clientHeight})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // Add Y axis
    const y = d3.scaleBand()
        .domain(groups)
        .range([0, clientHeight])
        .padding([0.2])

    svg.append("g")
        .call(d3.axisLeft(y));

    // color palette = one color per subgroup
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(['#e41a1c', '#377eb8', '#4daf4a'])

    //stack the data? --> stack per subgroup
    const stackedData = d3.stack()
        .keys(subgroups)
        (data)

    // Show the bars
    svg.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d.data.group))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth())

})








