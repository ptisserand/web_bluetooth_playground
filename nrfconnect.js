// convert time string from nrfconnect log to milliseconds
function convert_nrfconnect_time(time_str) {
    // time string is hh:mm:ss.ms
    let ret = 0;
    let parsed = time_str.match(/([0-9]+):([0-9]+):([0-9]+)\.([0-9]+)/)
    ret = parseInt(parsed[3]) + parseInt(parsed[2]) * 60 + parseInt(parsed[1]) * (60 * 60)
    ret = ret * 1000
    ret = ret + parseInt(parsed[4])
    return ret;
}

function convert_nrfconnect_frame(frame_str) {
    let ret = [];
    frame_str.match(/[0-9A-F]{2}/g).forEach(dd => {
        ret.push(parseInt(dd, 16));
    });
    return new Uint8Array(ret);
}


function extract_frame_data(log_line) {
    let parsed = log_line.match(/I\s+([0-9]+:[0-9]+:[0-9]+\.[0-9]+).* value: \(0x\) (.*)/);
    return {'time_str': parsed[1], 'frame_str': parsed[2]};
}

function convert_nrfconnect_log(full_log) {
    // filter line only containing notification received
    let ret = [];
    let notification_logs = full_log.match(/.*Notification received.*/g);
    let start = extract_frame_data(notification_logs[0]);
    let start_time = convert_nrfconnect_time(start.time_str);
    console.log("Start time: " + start_time);
    notification_logs.forEach(ll => {
        let frame = extract_frame_data(ll);
        let received_time = convert_nrfconnect_time(frame.time_str) - start_time;
        let values = convert_nrfconnect_frame(frame.frame_str).buffer;
        let atime = extractTimeFromFrame(values);
        ret.push({'received_time': received_time, 'time': atime, 'data': values});
    });
    return ret;
}