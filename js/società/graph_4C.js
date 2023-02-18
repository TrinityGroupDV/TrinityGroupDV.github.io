$(document).ready(function () {

    let aux = 0;
    draw()
    addEventListener("resize", (event) => {
        draw()
    })

    function draw() {
        let clientHeight = document.getElementById('graph_4C').clientHeight - 70;
        let clientWidth = document.getElementById('graph_4C').clientWidth - 100;

        // set the dimensions and margins of the graph
        const margin = { top: 30, right: 20, bottom: 40, left: 65 };
        if (aux == 1) {
            $("#graph_4C").empty();
        }
        aux = 1;

        // append the svg object to the body of the page
        var svg = d3.select("#graph_4C")
            .append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)


        // Parse the Data
        d3.csv("../../csv/società/graph_4C.csv")
            .then(function (data) {
                let values = new Array();
                let column = ["year", "state", "age", "value"];

                for (var i = 0; i < data.length; i++) {
                    values[i] = {};
                    values[i][column[0]] = data[i]["TIME_PERIOD"];
                    values[i][column[1]] = data[i]["geo"];
                    values[i][column[2]] = data[i]["age"];
                    values[i][column[3]] = data[i]["OBS_VALUE"];
                }

                const dataByYear = values.reduce((accumulator, currentValue) => {
                    const { year, ...rest } = currentValue;
                    if (!accumulator[year]) {
                        accumulator[year] = [];
                    }
                    accumulator[year].push(rest);
                    return accumulator;
                }, {});
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
                console.log(newData)

                let year2019 = [];
                let year2020 = [];
                let year2021 = [];

                //Funzione per riempire fli array
                function fill(array, a) {
                    let key_state;
                    let chiave;
                    let valore;
                    let length = Object.keys(newData[a]).length; //4
                    for (let i = 0; i < length; i++) {
                        switch (i) {
                            case 0:
                                array[i] = { state: 'Germany' };
                                key_state = Object.keys(newData[a])[i];
                                break;
                            case 1:
                                array[i] = { state: 'Spain' };

                                key_state = Object.keys(newData[a])[i];
                                break;
                            case 2:
                                array[i] = { state: 'France' };
                                key_state = Object.keys(newData[a])[i];
                                break;
                            case 3:
                                array[i] = { state: 'Italy' };
                                key_state = Object.keys(newData[a])[i];
                                break;
                        }

                        for (let j = 0; j < 6; j++) {
                            chiave = Object.keys(newData[a][key_state][j])[0]
                            valore = newData[a][key_state][j][chiave]
                            array[i][chiave] = valore;
                        }
                    }
                }
                for (let i = 0; i < newData.length; i++) {
                    switch (i) {
                        case 0:
                            fill(year2019, i);
                            break;
                        case 1:
                            fill(year2020, i);
                            break;
                        case 2:
                            fill(year2021, i);
                            break;
                    }
                }

                let array = [];

                array = year2019;


                function update(array) {


                    svg.selectAll("rect").remove();

                    // List of subgroups = header of the csv files = soil condition here
                    const subgroups = Object.keys(array[0]).slice(1);
                    // console.log(subgroups)

                    // List of groups = species here = value of the first column called group -> I show them on the X axis
                    const groups = array.map(d => (d.state))
                    // console.log(groups)

                    // Add X axis
                    const x = d3.scaleLinear()
                        .domain([18000, 0])
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
                        .range(['#e41a1c', '#377eb8', '#4daf4a', '#aabbcc', '#bbccaa', '#4f4d4d'])

                    //stack the data? --> stack per subgroup
                    const stackedData = d3.stack()
                        .keys(subgroups)
                        (array)
                    // console.log(stackedData)

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
                        .attr("y", d => y(d.data.state))
                        .attr("width", d => x(d[1]) - x(d[0]))
                        .attr("height", y.bandwidth())
                }

                update(array)

                $('.btt').on('click', function () {
                    $('.btt').removeClass('active');
                    $(this).addClass('active');
                });
                var buttons = document.querySelectorAll("button[data-value]");

                buttons.forEach(function (button) {
                    button.addEventListener("click", function () {
                        // console.log(array)
                        // array.length = 0;
                        var value = button.getAttribute("data-value");
                        switch (value) {
                            case "valore1":
                                array = year2019;
                                update(array)
                                break;
                            case "valore2":
                                array = year2020;
                                update(array)
                                break;
                            case "valore3":
                                array = year2021;
                                update(array)
                                break;
                        }
                        console.log(array)
                    });
                });
            })
    }
})








