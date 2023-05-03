"use strict";

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const axios = require('axios');

const port = new SerialPort('/dev/ttyACM0', { baudRate: 9600 });
const parser = new ReadlineParser();
port.pipe(parser);

const url = 'http://medmanageuw.loca.lt';

parser.on('data', (data) => {
    axios.post(url, {
        message: data
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error(error);
    });
});