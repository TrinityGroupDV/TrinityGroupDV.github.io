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
        const margin = { top: 30, right: 20, bottom: 80, left: 65 };
        if (aux == 1) {
            $("#graph_4C").empty();
        }
        aux = 1;

        // append the svg object to the body of the page
        let svg = d3.select("#graph_4C")
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

                let year2019 = [];
                let year2020 = [];
                let year2021 = [];
                let keys = ['state', '<18', '18-24', '25-49', '50-64', '65-74', '>75'];

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
                function fix(array) {
                    let values = new Array();
                    let help = new Array();
                    let newKeys = ['state', 'under_18', '_18-24', '_25-49', '_50-64', '_65-74', 'above_75'];
                    for (let i = 0; i < array.length; i++) {
                        help[i] = {};
                        values = Object.values(array[i]);
                        values.splice(1, 0, values.splice(6, 1)[0]);
                        for (let j = 0; j < newKeys.length; j++) {
                            help[i][newKeys[j]] = values[j];
                        }
                    }
                    return help;
                }

                for (let i = 0; i < newData.length; i++) {
                    switch (i) {
                        case 0:
                            fill(year2019, i);
                            year2019 = fix(year2019)
                            break;
                        case 1:
                            fill(year2020, i);
                            year2020 = fix(year2020)
                            break;
                        case 2:
                            fill(year2021, i);
                            year2021 = fix(year2021)
                            break;
                    }
                }

                let array = [];
                array = year2019;
                function update(array) {

                    svg.selectAll("rect").remove();
                    svg.selectAll("path").remove();
                    svg.selectAll("text").remove();

                    //Label
                    svg.append("text")
                        .attr("class", "legend4C")
                        .attr("x", "40%")
                        .attr("y", 385)
                        .text("Thousands people")
                        .style("font-size", "100%")
                        .attr("alignment-baseline", "middle")

                    //Legend
                    const legendData = [
                        { x: '4%', color: '#46d366', label: '<18' },
                        { x: '19%', color: '#00d6ff', label: '18-24' },
                        { x: '34%', color: '#007fff', label: '25-49' },
                        { x: '49%', color: '#a862ea', label: '50-64' },
                        { x: '64%', color: '#ff3e6b', label: '65-74' },
                        { x: '79%', color: '#ffbf29', label: '>75' }
                    ];
                    const legendGroup = svg.append('g').attr('class', 'legend4B');
                    legendGroup.selectAll('rect')
                        .data(legendData)
                        .enter()
                        .append('rect')
                        .attr('class', 'legend4B')
                        .attr('x', d => d.x)
                        .attr('y', 405)
                        .attr('width', '5%')
                        .attr('height', 7)
                        .style('fill', d => d.color);

                    legendGroup.selectAll('text')
                        .data(legendData)
                        .enter()
                        .append('text')
                        .attr('class', 'legend4B')
                        .attr('x', d => {
                            const width = parseFloat(d.x) + 6;
                            return `${width}%`;
                        })
                        .attr('y', 410)
                        .text(d => d.label)
                        .style('font-size', '1vi')
                        .attr('alignment-baseline', 'middle');

                    // List of subgroups = header of the csv files = soil condition here
                    const subgroups = Object.keys(array[0]).slice(1);

                    // List of groups = species here = value of the first column called group -> I show them on the X axis
                    const groups = array.map(d => (d.state))

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
                        .range(['#46d366', '#00d6ff', '#007fff', '#a862ea', '#ff3e6b', '#ffbf29'])

                    const stackedData = d3.stack()
                        .keys(subgroups)
                        (array)

                    const Tooltip = d3.select("#graph_4C")
                        .append("div")
                        .attr("class", "tooltip4C")
                        .style("opacity", 0)
                        .style("position", "absolute")
                        .style("background-color", "white")
                        .style("border", "solid")
                        .style("border-width", "2px")
                        .style("border-radius", "5px")
                        .style("padding", "5px")
                        .style("font-size", "12px");


                    const mouseover = function (event, d) {
                        Tooltip.style("opacity", 1);
                        let legend = d3.select(this).datum()
                        let total = legend[1] - legend[0]
                        const subgroupName = d3.select(this.parentNode).datum().key;
                        let index = d3.select(this.parentNode).datum().index;
                        Tooltip.html('Age range: ' + keys[index + 1] + '<br>' + 'Total: ' + total + ' thousand people')
                            .style("left", (event.offsetX + 20) + "px") // aggiunto 20px per spostare il tooltip a destra
                            .style("top", (event.offsetY) + "px"); // sottratto 20px per spostare il tooltip in alto

                        d3.selectAll(".myRect ").style("opacity", 0.2)
                        d3.selectAll("." + subgroupName).style("opacity", 1)
                    }

                    const mousemove = function (event, d) {
                        Tooltip.style("transform", "translateY(-10%)")
                            .style("left", (event.offsetX + 20) + "px")
                            .style("top", (event.offsetY) + "px")
                    }

                    const mouseout = function (event, d) {
                        d3.selectAll(".myRect")
                            .style("opacity", 1)
                        Tooltip.style("opacity", 0);
                    }

                    // Show the bars
                    svg.append("g")
                        .selectAll("g")
                        .data(stackedData)
                        .join("g")
                        .attr("fill", d => color(d.key))
                        .attr("class", d => "myRect " + d.key)
                        .selectAll("rect")
                        .data(d => d)
                        .join("rect")
                        .attr("x", d => x(d[0]))
                        .attr("y", d => y(d.data.state))
                        .attr("width", d => x(d[1]) - x(d[0]))
                        .attr("height", y.bandwidth())
                        .attr("stroke", "white")
                        .on("mouseover", mouseover)
                        .on("mousemove", mousemove)
                        .on("mouseout", mouseout);
                }

                update(array)
                $('.btt').on('click', function () {
                    $('.btt').removeClass('active');
                    $(this).addClass('active');
                });
                let buttons = document.querySelectorAll("button[data-value]");
                buttons.forEach(function (button) {
                    button.addEventListener("click", function () {
                        let value = button.getAttribute("data-value");
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
                    });
                });
            })
    }
})








