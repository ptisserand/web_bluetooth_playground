function computeDeltaTime(data) {
    let delta_time = [];
    let old_time = data[0].time;
    for (let i=1; i < data.length; ++i) {
        delta_time.push(data[i].time - old_time);
        old_time = data[i].time;
    }
    return delta_time;
}

function extractTimeFromFrame(frame) {
    let dataview = new DataView(frame);
    return dataview.getUint32(dataview.byteLength - 5, false);
}

