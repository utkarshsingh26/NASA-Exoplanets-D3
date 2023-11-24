let svg;
const height = 600;
const width = 1100;
const margin = {top : 30, right : 30, bottom : 30, left : 30};
const chartHeight = height - margin.top - margin.bottom;
const chartWidth = width - margin.left - margin.right;
const color = d3.scaleOrdinal(d3.schemeSet3);
let buttonClicked = false;

window.onload = function() {
    alert("Try to hover over and click the dots to find out more about our universe!");
};

document.addEventListener('DOMContentLoaded', function () {

    svg = d3.select('#innovate')
    .attr('width', width)
    .attr('height', height);


    Promise.all([d3.csv('data/space.csv')])
        .then(function (values){

            svg.append("rect").attr("x", 794).attr("y", 24).attr("width", 12).attr("height", 12).style("fill", "yellow");
            svg.append("rect").attr("x", 794).attr("y", 46).attr("width", 12).attr("height", 12).style("fill", "red");
            svg.append("rect").attr("x", 794).attr("y", 66).attr("width", 12).attr("height", 12).style("fill", "blue");
            svg.append("rect").attr("x", 794).attr("y", 86).attr("width", 12).attr("height", 12).style("fill", "green");
            svg.append("rect").attr("x", 794).attr("y", 106).attr("width", 12).attr("height", 12).style("fill", "white");
            svg.append("text").attr("x", 820).attr("y", 30).text("Gas Giant").style("font-size", "15px").attr("alignment-baseline","middle").style("fill","yellow");
            svg.append("text").attr("x", 820).attr("y", 50).text("Neptune-like").style("font-size", "15px").attr("alignment-baseline","middle").style("fill","red");
            svg.append("text").attr("x", 820).attr("y", 70).text("Super Earth").style("font-size", "15px").attr("alignment-baseline","middle").style("fill","blue");
            svg.append("text").attr("x", 820).attr("y", 90).text("Terrestrial").style("font-size", "15px").attr("alignment-baseline","middle").style("fill","green");
            svg.append("text").attr("x", 820).attr("y", 110).text("Unknown").style("font-size", "15px").attr("alignment-baseline","middle").style("fill","white");
            // svg.append("text").attr("x", 480).attr("y", 600).text("Year of Discovery").style("font-size", "15px").attr("alignment-baseline","middle").style("fill","white");

           var untamperedData = values[0];

           var scatterData = [];

           var stellarMagnitude = [];
           var year = [];

           for(let i=0; i<untamperedData.length; i++){
            if(untamperedData[i].stellar_magnitude == ""){
                untamperedData[i].stellar_magnitude = "0.00"
            }
            year.push(parseInt(untamperedData[i].discovery_year));
            stellarMagnitude.push(parseFloat(untamperedData[i].stellar_magnitude));
        }

            let g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

            const xScale = d3.scaleLinear().domain(d3.extent(year)).range([0,chartWidth]);

            g.append('g')
            .attr("class", "axisWhite")
            .attr('transform', `translate(0,${chartHeight})`)
            .call(d3.axisBottom(xScale))
            .style('fill', 'white');

            svg.append("text")
            .attr("class", "xAxis_label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", height + 2)
            .style('fill', 'white')
            .style('font-size', '12px')
            .text("Year of Discovery");

            const yScale = d3.scaleLinear().domain(d3.extent(stellarMagnitude)).range([chartHeight,0])
                   
            g.append('g')
            .attr("class", "axisWhite")
            .call(d3.axisLeft(yScale))
            .style('fill', 'white');

            svg.append("text")
            .attr("class", "yAxis_label")
            .attr("text-anchor", "middle")
            .attr("x", -height/2)
            .attr("y", -4)
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .style('fill', 'white')
            .style('font-size', '12px')
            .text("Stellar Magnitude");

            var circles = svg.append('g')
            .selectAll("dot")
            .data(untamperedData)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(d.discovery_year); } )
            .attr("cy", function (d) { return yScale(d.stellar_magnitude); } )
            .attr("r", 6)
            .style("fill", function (d){
                if(d.planet_type == "Gas Giant"){
                    return 'yellow';
                } else if(d.planet_type == "Neptune-like"){
                    return 'red'
                } else if(d.planet_type == "Super Earth"){
                    return 'blue';
                } else if(d.planet_type == "Terrestrial"){
                    return 'green';
                } else if(d.planet_type == "Unknown"){
                    return 'white';
                }
            })
            .on("mouseover",(event,d) =>{
                let tooltip = d3.select('.tooltip')
                tooltip.style('display', 'block')
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY - 30}px`)
                .html(`<strong>Name:</strong> ${d.name}<br><strong>Distance:</strong> ${d.distance}<br><strong>Stellar Magnitude:</strong> ${d.stellar_magnitude}<br><strong>Planet Type:</strong> ${d.planet_type}<br><strong>Discovery Year: </strong> ${d.discovery_year}<br><strong>Mass Multiplier: </strong> ${d.mass_multiplier}<br><strong>Mass with respect to: </strong> ${d.mass_wrt}<br><strong>Radius Multiplier: </strong> ${d.radius_multiplier}<br><strong>Radius with respect to: </strong> ${d.radius_wrt}<br><strong>Orbital Radius: </strong> ${d.orbital_radius}<br><strong>Oribital Period: </strong> ${d.orbital_period}<br><strong>Eccentricity: </strong> ${d.eccentricity}<br><strong>Direction Method: </strong> ${d.direction_method}`)
            })
            .on("mouseout", () =>{
                d3.select('.tooltip').style('display','none')
            })
            .on("click", (event, d) => {
                const tooltip = d3.select('.tooltip');

                tooltip.html('');
            
                const parallelCoordinatesData = prepareParallelCoordinates(d);
                console.log(parallelCoordinatesData)
            
                createParallelCoordinatePlot(parallelCoordinatesData);
            
                tooltip.style('display', 'block')
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY - 30}px`);
            });


            const expand = document.getElementById("expand");

            expand.addEventListener("click", function () {

                expand.textContent = "Kaboom! (Refresh to go back to the original state)";

                const xAxis = g.selectAll(".axisWhite");
                const xAxisLabel = svg.select(".xAxis_label");
                const yAxisLabel = svg.select(".yAxis_label")

                xAxis.remove();
                xAxisLabel.remove();
                yAxisLabel.remove();


                let simulation = d3.forceSimulation(untamperedData)
                .force('x', d3.forceX(d => xScale(d.discovery_year)).strength(1))
                .force('y', d3.forceY(chartHeight / 2).strength(1))
                .force('collide', d3.forceCollide(6).strength(1))
                .alphaDecay(0)
                .alpha(0.3)
                .on('tick', tick);
              
              function tick() {
                circles.attr("cx", d => d.x)
                  .attr("cy", d => d.y);
              }
              
              setTimeout(() => {
                simulation.alphaDecay(0.1);
              }, 3000);
            });
            

        })

});


function prepareParallelCoordinates(data){
    
    var obj = {
        "Mass Multiplier" : data.mass_multiplier,
        "Radius Multiplier" : data.radius_multiplier,
        "Orbital Radius" : data.orbital_radius,
        "Orbital Period" : data.orbital_period
    }

    return obj;
}

function createParallelCoordinatePlot(data) {
    
    const tooltipWidth = 300;
    const tooltipHeight = 200;

    const margin = { top: 20, right: 40, bottom: 20, left: 40 };
    const parallelWidth = tooltipWidth - margin.left - margin.right;
    const parallelHeight = tooltipHeight - margin.top - margin.bottom;

    const keys = Object.keys(data);
    const values = Object.values(data);

    const svg = d3.select('.tooltip')
        .append('svg')
        .attr('width', tooltipWidth)
        .attr('height', tooltipHeight);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const paralellXScale = d3.scalePoint().range([0, parallelWidth]).domain(keys);

    const temp = values.map(parseFloat);

    const valueMax = d3.max(temp);

    const parallelYScale = d3.scaleLinear()
        .domain([0, valueMax])
        .range([parallelHeight, 0]);

    const line = d3.line()
        .x((d, i) => paralellXScale(keys[i]))
        .y(d => parallelYScale(parseFloat(d)));

    g.append('path')
        .datum(values)
        .attr('d', line)
        .style('fill', 'none')
        .style('stroke', 'darkblue')
        .style('stroke-width', 2);


    g.selectAll('.paralleldataPoints')
        .data(values)
        .enter()
        .append('circle')
        .attr('class', 'paralleldataPoints')
        .attr('cx', (d, i) => paralellXScale(keys[i]))
        .attr('cy', d => parallelYScale(parseFloat(d)))
        .attr('r', 5)
        .style('fill', 'red');

        g.selectAll('.paralleldataLabels')
        .data(values)
        .enter()
        .append('text')
        .attr('class', 'paralleldataLabels')
        .attr('x', (d, i) => paralellXScale(keys[i]))
        .attr('y', d => parallelYScale(parseFloat(d)) + 20) 
        .text(d => d) 
        .style('text-anchor', 'middle')
        .style('fill', 'black');
        

        g.selectAll('.parallelaxisLabels')
        .data(keys)
        .enter()
        .append('text')
        .attr('class', 'parallelaxisLabels')
        .attr('x', (d, i) => paralellXScale(keys[i]))
        .attr('y', -10) 
        .text(d => d)
        .style('text-anchor', 'middle')
        .style('fill', 'black');
}


