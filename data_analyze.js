// trust me baby
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

function getSVG(cont_name, id) {
    // append the svg object to the body of the page
    let svg = document.getElementById(id);
    if (null != svg) {
        svg.remove();
    }
    svg = d3.select(cont_name)
        .append("svg")
        .attr("id", id)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    return svg;
}

function updateDisplayReceivedTime(data) { 
    let svg = getSVG("#data_received_time", "svg_data_received_time");    

    // X axis
    let x = d3.scaleLinear()
        .domain([d3.min(data, function(d) {return +d.received_time}), d3.max(data, function(d) { return +d.received_time})])
        .range([0, width]);
    let xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
    // Y axis
    let y = d3.scaleLinear()
        .domain([d3.min(data, function(d) {return +d.time}), d3.max(data, function(d) { return +d.time})])
        .range([ height, 0]);
    let yAxis = svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.received_time)})
            .y(function(d) { return y(d.time)})
        );
}

function updateDisplayDeltaFrameTime(data) {
    let svg = getSVG("#data_delta_frame_time", "svg_data_delta_frame_time");
 
    let delay_data = []
    let old_time = data[0].time;
    for (let i=1; i < data.length; ++i) {
        delay_data.push(data[i].time - old_time);
        old_time = data[i].time;
    }
    
    // X axis
    let x = d3.scaleLinear()
        .domain([0, delay_data.length])
        .range([0, width])
    let xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
    // Y axis
    let y = d3.scaleLinear()
        .domain([0, d3.max(delay_data, function(d) { return d})])
        .range([ height, 0])
    let yAxis = svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("path")
        .datum(delay_data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
            .x(function(d, i) {return x(i)})
            .y(function(d) {return y(d)})
        );
}
function updateDataAnalyze(data) {
    if (data.length == 0) {
        alert("ERROR: No data available");
        return;
    }
    updateDisplayDeltaFrameTime(data);
    updateDisplayReceivedTime(data);

}