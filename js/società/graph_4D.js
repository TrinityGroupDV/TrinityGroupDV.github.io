$(document).ready(async function () {

    /*
        // List of words
        var myWords = [
            { word: "SARS-CoV-2", size: "70" },
            { word: "COVID-19", size: "23.6" },
            { word: "China", size: "19.2" },
            { word: "SARS", size: "12.1" },
            { word: "Epidemic", size: "9.1" },
            { word: "Adult", size: "8.1" },
            { word: "Psychological", size: "8.1" },
            { word: "Nucleic acids", size: "6.3" },
            { word: "Infection", size: "5.8" },
            { word: "Plague", size: "5.8" },
            { word: "Child", size: "4.3" },
            { word: "Antiviral drugs", size: "4.3" },
            { word: "Nursing", size: "4.3" },
            { word: "Therapeutics", size: "3.2" },
            { word: "Diagnosis", size: "2.7" },
            { word: "MERS", size: "2.7" },
            { word: "Clinical feature", size: "2.7" },
            { word: "Nurses", size: "2.3" },
            { word: "Amino acid", size: "2.3" },
            { word: "Angiotensin", size: "2.3" }
    
        ]*/
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

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#graph_4D").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    /* var svg = d3.select("#graph_4D")
         .append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .append("g")
         .attr("transform", `translate(${margin.left},${margin.top})`);*/

    const highlight = function (event, d) {

        let legend = d3.select(this).datum()
        console.log(legend)
        console.log(legend.size)

        var frequency = parseFloat([(legend.size * legend.size) / 210]).toFixed(2)

        svg.append("text")
            .attr("class", "legend")
            .attr("text-anchor", "middle")
            .attr("x", 100)
            .attr("y", 20)
            .text(frequency + "%")
            .style("font-size", "18px")

    }


    // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
    // Wordcloud features that are different from one word to the other must be here
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function (d) { return { text: d.word, size: d.size }; }))
        .padding(5)        //space between words
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .fontSize((d) => Math.sqrt(d.size * 210))    //  MODIFICARE 210 PER LA DIMENSIONEEEEEEEEEE
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
            .on("mouseover", highlight)

    }
    /*
        var fill = d3.scaleOrdinal(d3.schemeCategory20);
    
        var data = [
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
    
        var margin = { top: 10, right: 10, bottom: 10, left: 10 },
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
    
        // append the svg object to the body of the page
        var svg = d3.select("#graph_4D").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
    
        var layout = d3.layout.cloud()
            .size([400, 300])
            .words(data)
            .on("end", draw);
        layout.start();
    
        function draw(words) {
            svg
                .append("g")
                .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                .selectAll("text")
                .data(words)
                .enter()
                .append("text")
                .text((d) => d.word)
                .style("font-size", (d) => d.size * 2 + "px")
                .style("font-family", (d) => d.font)
                .style("fill", "black")
                .attr("text-anchor", "middle")
                .attr("transform", (d) => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")");
        }*/
})






