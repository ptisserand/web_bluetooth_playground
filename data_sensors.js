function parse_sensor(frame, offset) {
    let atime = extractTimeFromFrame(frame);
    let dataview = new DataView(frame);
    let accel = {};
    let gyro = {};
    let tmp_buffer = new ArrayBuffer(4);
    let tmp_view = new DataView(tmp_buffer);

    accel.time = atime;
    gyro.time = atime;
    tmp_val = dataview.getUint16(offset + 0);
    tmp_val = tmp_val & 0xFFF0;
    tmp_view.setUint16(0, tmp_val);
    accel.x = tmp_view.getInt16(0);

    tmp_val = dataview.getUint16(offset + 1);
    tmp_val = tmp_val << 4;
    tmp_view.setUint16(0, tmp_val);
    accel.y = tmp_view.getInt16(0);

    tmp_val = dataview.getUint16(offset + 3);
    tmp_val = tmp_val & 0xFFF0;
    tmp_view.setUint16(0, tmp_val);
    accel.z = tmp_view.getInt16(0);

    tmp_val = dataview.getUint16(offset + 4);
    tmp_val = tmp_val << 4;
    tmp_view.setUint16(0, tmp_val);
    gyro.x = tmp_view.getInt16(0);
 
    tmp_val = dataview.getUint16(offset + 6);
    tmp_val = tmp_val & 0xFFF0;
    tmp_view.setUint16(0, tmp_val);
    gyro.y = tmp_view.getInt16(0);

    tmp_val = dataview.getUint16(offset + 7);
    tmp_val = tmp_val << 4;
    tmp_view.setUint16(0, tmp_val);
    gyro.z = tmp_view.getInt16(0);

    return {'accel': accel, 'gyro': gyro};
}

function extract_sensors(sensors_data) {
    let cuisse = {'accel': [], 'gyro': []};
    let mollet = {'accel': [], 'gyro': []};

    sensors_data.forEach(dd => {
        let sensor = parse_sensor(dd.data, 0);
        cuisse.accel.push(sensor.accel);
        cuisse.gyro.push(sensor.gyro);
        sensor = parse_sensor(dd.data, 9);
        mollet.accel.push(sensor.accel);
        mollet.gyro.push(sensor.gyro);
    });

    return {'cuisse': cuisse, 'mollet': mollet};
}

