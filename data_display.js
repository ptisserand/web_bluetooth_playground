// import {computeDeltaTime} from './data_common.mjs';

/*******************************************************************************
 * 
 * 
 * 
 *******************************************************************************/
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60};

function getSVG(cont_name, id) {
    // append the svg object to the body of the page
    let svg = document.getElementById(id);
    if (null != svg) {
        svg.remove();
    }
    svg = d3.select(cont_name)
        .append("svg")
        .attr("id", id)
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    el = svg.node().parentElement;
    width = el.getBoundingClientRect().width - margin.left - margin.right;
    // height = el.getBoundingClientRect().height - margin.top - margin.bottom;
    return svg;
}

function updateDisplay1D(svg, data) {
    let rect = svg.node().parentElement.getBoundingClientRect()
    let height = rect.height - margin.left - margin.right;
    let width = rect.width - margin.top - margin.bottom;

    // X axis
    let x = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, width])
    let xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
    // Y axis
    let y = d3.scaleLinear()
        .domain([d3.min(data, function(d) {return d}), d3.max(data, function(d) { return d})])
        .range([ height, 0])
    let yAxis = svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2.5)
        .attr("d", d3.line()
            .x(function(d, i) {return x(i)})
            .y(function(d) {return y(d)})
        );
    
}

function updateDisplay2D(svg, data_2d) {
    let rect = svg.node().parentElement.getBoundingClientRect()
    let height = rect.height - margin.left - margin.right;
    let width = rect.width - margin.top - margin.bottom;

    // X axis
    let x = d3.scaleLinear()
        .domain([d3.min(data_2d, function(d) {return d.x}), d3.max(data_2d, function(d) { return d.x})])
        .range([0, width]);
    let xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
    // Y axis
    let y = d3.scaleLinear()
        .domain([d3.min(data_2d, function(d) {return d.y}), d3.max(data_2d, function(d) { return d.y})])
        .range([ height, 0]);
    let yAxis = svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.append("path")
        .datum(data_2d)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.x)})
            .y(function(d) { return y(d.y)})
        );

}

function updateDisplay3Axis(svg, data_3axis) {
    let rect = svg.node().parentElement.getBoundingClientRect()
    let height = rect.height - margin.left - margin.right;
    let width = rect.width - margin.top - margin.bottom;

    // time axis
    let t = d3.scaleLinear()
       .domain([d3.min(data_3axis, function(d) {return d.time}), d3.max(data_3axis, function(d) { return d.time})])
       .range([0, width]);
    let tAxis = svg.append("g")
       .attr("transform", "translate(0," + height + ")")
       .call(d3.axisBottom(t));
    
    let xmin = d3.min(data_3axis, function(d) {return d.x});
    let xmax = d3.max(data_3axis, function(d) {return d.x});
    let ymin = d3.min(data_3axis, function(d) {return d.y});
    let ymax = d3.max(data_3axis, function(d) {return d.y});
    let zmin = d3.min(data_3axis, function(d) {return d.z});
    let zmax = d3.max(data_3axis, function(d) {return d.z});

    let axis_min = d3.min([xmin, ymin, zmin]);
    let axis_max = d3.max([xmax, ymax, zmax]);

    // Y axis
    let y = d3.scaleLinear()
        .domain([axis_min, axis_max])
        .range([ height, 0]);
    let yAxis = svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.append("path")
        .datum(data_3axis)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return t(d.time)})
            .y(function(d) { return y(d.x)})
        );

    svg.append("path")
        .datum(data_3axis)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return t(d.time)})
            .y(function(d) { return y(d.y)})
        );
    
    svg.append("path")
        .datum(data_3axis)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return t(d.time)})
            .y(function(d) { return y(d.z)})
        );
}

function updateDisplayAcceleroCuisse(data) {
    let svg = getSVG("#data_accelero_cuisse", "svg_data_accelero_cuisse");
    let sensors = extract_sensors(data);

    updateDisplay3Axis(svg, sensors.cuisse.accel);
}

function updateDisplayGyroCuisse(data) {
    let svg = getSVG("#data_gyro_cuisse", "svg_data_gyro_cuisse");
    let sensors = extract_sensors(data);

    updateDisplay3Axis(svg, sensors.cuisse.gyro);
}


function updateDisplayAcceleroMollet(data) {
    let svg = getSVG("#data_accelero_mollet", "svg_data_accelero_mollet");
    let sensors = extract_sensors(data);

    updateDisplay3Axis(svg, sensors.cuisse.accel);
}

function updateDisplayGyroMollet(data) {
    let svg = getSVG("#data_gyro_mollet", "svg_data_gyro_mollet");
    let sensors = extract_sensors(data);

    updateDisplay3Axis(svg, sensors.cuisse.gyro);
}

function updateDisplayReceivedTime(data) { 
    let svg = getSVG("#data_received_time", "svg_data_received_time");    
    let data_2d = [];    
    data.forEach(d => {
        data_2d.push({'x': +d.received_time, 'y': +d.time});        
    });

    updateDisplay2D(svg, data_2d);
}

function updateDisplayDeltaFrameTime(data) {
    let svg = getSVG("#data_delta_frame_time", "svg_data_delta_frame_time");
 
    let delay_data = computeDeltaTime(data);
    updateDisplay1D(svg, delay_data);    
}

function updateDataDisplay(data) {
    if (data.length == 0) {
        alert("ERROR: No data available");
        return;
    }
    updateDisplayDeltaFrameTime(data);
    updateDisplayReceivedTime(data);
    updateDisplayAcceleroCuisse(data);
    updateDisplayGyroCuisse(data);
    updateDisplayAcceleroMollet(data);
    updateDisplayGyroMollet(data);
}
