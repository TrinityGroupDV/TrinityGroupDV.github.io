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

        // Inizitialization array all data links and aux variable


        let values = new Array();
        let column = ["year", "state", "age", "value"];
        let states = ['DE', 'ES', 'FR', 'IT'];
        let year2019 = [{}, {}, {}, {}];
        let year2020 = [{}, {}, {}, {}];
        let year2021 = [{}, {}, {}, {}];

        // Parse the Data
        // d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv")
        d3.csv("../../csv/società/graph_4C.csv")
            .then(function (data) {
                // console.log(typeof (data))
                console.log(data)
                // console.log(data.length)
                // console.log(data[0]["TIME_PERIOD"])
                console.log(data[0])



                console.log("-------------------------------------------------------------------------------")



                //  let anno2019 =[ {state: 'IT', Y18-24: '21.3',  Y25-49: '14.9', Y50-64: '19.2', Y65-74: '22.5'}
                // {state: 'FR', Y18-24: '21.3',  Y25-49: '14.9', Y50-64: '19.2', Y65-74: '22.5'}]

                let j = 0;
                for (var i = 0; i < data.length; i++) {


                    values[i] = {};
                    values[i][column[0]] = data[i]["TIME_PERIOD"];
                    values[i][column[1]] = data[i]["geo"];
                    values[i][column[2]] = data[i]["age"];
                    values[i][column[3]] = data[i]["OBS_VALUE"];



                    switch (data[i]["TIME_PERIOD"]) {
                        case '2019':
                            switch (data[i]["geo"]) {
                                case 'DE':
                                    year2019
                                    break;
                                case 'ES':
                                    break;
                                case 'FR':
                                    break;
                                case 'IT':
                                    break;


                            }


                            break;
                        case '2020':
                            break;
                        case '2021':
                            break;


                    }
                }

                console.log("----------------------")
                console.log(j)
                console.log(values)






                const dataByYear = values.reduce((accumulator, currentValue) => {
                    const { year, ...rest } = currentValue;
                    if (!accumulator[year]) {
                        accumulator[year] = [];
                    }
                    accumulator[year].push(rest);
                    // console.log(rest)
                    return accumulator;
                }, {});

                console.log(dataByYear);
                let newData = new Array();


                for (var i = 0; i < Object.keys(dataByYear).length; i++) {
                    help = dataByYear[Object.keys(dataByYear)[i]].reduce((accumulator, currentValue) => {
                        const { state, ...rest } = currentValue;
                        if (!accumulator[state]) {
                            accumulator[state] = [];
                        }
                        obj = {
                            [rest["age"]]: rest["value"]
                        }
                        accumulator[state].push(obj);
                        return accumulator;
                    }, {});
                    newData.push(help)
                }
                console.log("----------------------")

                // console.log(newData);

                let anno2019 = new Array();
                // console.log(Object.keys(newData[0])[0])
                // console.log(Object.keys(newData[0])[1])
                for (let i = 0; i < Object.keys(newData[0]).length; i++) {






                    // for (let j = 0; j < Object.keys(newData[0])[1]; j++) {
                    //     console.log(Object.keys(newData[0])[i])
                    // }

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
    }

})





