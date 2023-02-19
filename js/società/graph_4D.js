$(document).ready(async function () {

    let aux = 0;
    draw()

    addEventListener("resize", (event) => {
        draw()
    })

    function draw() {

        let clientHeight = document.getElementById('graph_4D').clientHeight;
        let clientWidth = document.getElementById('graph_4D').clientWidth - 70;

        // Set margin
        const margin = { top: 10, right: 20, bottom: 10, left: 20 };
        if (aux == 1) {
            $("#graph_4D").empty();
        }
        aux = 1;


        var myWords = [
            { word: "SARS-CoV-2", size: "19.7" },
            { word: "COVID-19", size: "9.3" },
            { word: "China", size: "7.6" },
            { word: "SARS", size: "4.8" },
            { word: "Epidemic", size: "3.6" },
            { word: "Adult", size: "3.2" },
            { word: "Psychological", size: "3.2" },
            { word: "Nucleic acids", size: "2.5" },
            { word: "Infection", size: "2.3" },
            { word: "Plague", size: "2.3" },
            { word: "Child", size: "1.7" },
            { word: "Antiviral drugs", size: "1.7" },
            { word: "Nursing", size: "1.7" },
            { word: "Therapeutics", size: "1.3" },
            { word: "Diagnosis", size: "1.1" },
            { word: "MERS", size: "1.1" },
            { word: "Clinical feature", size: "1.1" },
            { word: "Nurses", size: "0.9" },
            { word: "Amino acid", size: "0.9" },
            { word: "Angiotensin", size: "0.9" }
        ]

        // Append the svg object to the body of the page
        var svg = d3.select("#graph_4D").append("svg")
            .attr("width", clientWidth + margin.left + margin.right)
            .attr("height", clientHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        const Tooltip = d3.select("#graph_4D")
            .append("div")
            .attr("class", "tooltip")
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
        }

        // Move tooltip on mousemove
        const mousemove = function (event, d) {
            let legend = d3.select(this).datum()
            var frequency = parseFloat([(legend.size * legend.size) / 210]).toFixed(2)
            console.log(frequency)
            Tooltip.html('Frequency: ' + frequency + "%")
                .style("left", (event.offsetX + 20) + "px") // aggiunto 20px per spostare il tooltip a destra
                .style("top", (event.offsetY - 20) + "px"); // sottratto 20px per spostare il tooltip in alto
        }

        // Hide tooltip on mouseout
        const mouseout = function (event, d) {
            Tooltip.style("opacity", 0);
        }

        const highlight = function (event, d) {

            let legend = d3.select(this).datum()
            var frequency = parseFloat([(legend.size * legend.size) / 210]).toFixed(2)
            svg.selectAll("text.freq4D").remove()
            svg.append("text")
                .attr("class", "freq4D")
                .attr("text-anchor", "middle")
                .attr("x", 100)
                .attr("y", 20)
                .text(frequency + "%")
                .style("font-size", "18px")
        }

        // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
        // Wordcloud features that are different from one word to the other must be here
        var layout = d3.layout.cloud()
            .size([clientWidth, clientHeight])
            .words(myWords.map(function (d) { return { text: d.word, size: d.size }; }))
            .padding(5)        //space between words
            .rotate(function () { return ~~(Math.random() * 2) * 90; })
            .fontSize((d) => Math.sqrt(d.size * 210))    //  Modificare 210 per la dimensione
            .on("end", draw);
        layout.start();

        // This function takes the output of 'layout' above and draw the words
        // Wordcloud features that are THE SAME from one word to the other can be here
        function draw(words) {
            svg
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function (d) { return d.size; })
                .style("fill", "#69b3a2")
                .attr("text-anchor", "middle")
                .style("font-family", "Impact")
                .attr("transform", function (d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })

                .text(function (d) { return d.text; })
                .on("mouseover", mouseover)
                //.on("mouseover", highlight)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout);
        }
    }
})






