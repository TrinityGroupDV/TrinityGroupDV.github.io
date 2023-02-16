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
        let dataValue = [];
        let year = ["2019", "2020", "2021"];
        let state = ["DE", "ES", "FR", "IT"];
        let age =["u18", "18-24", "25-49", "50-64", "65-74", "o75"];
        

            // Parse the Data
            // d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv")
            d3.csv("../../csv/società/graph_4C.csv").then(function (data) {
                console.log(data)

                // List of subgroups = header of the csv files = soil condition here
                const subgroups = data.columns.slice(1)

                // List of groups = species here = value of the first column called group -> I show them on the X axis
                const groups = data.map(d => (d.group))

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





