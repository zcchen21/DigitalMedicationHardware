"use strict";

const { SerialPort } = require('serialport');
//const Readline = require('@serialport/parser-readline');
const axios = require('axios');
const axiosRetry = require('axios-retry');

const port = new SerialPort({
    path: '/dev/ttyACM0',
    baudRate: 9600
  })
//const parser = new ReadlineParser();
//port.pipe(parser);

axiosRetry(axios, {
    retries: 3 ,
    retryDelay: axiosRetry.exponentialDelay
});

let confirmedObject = {
  confirmed: true
};

const site_url = 'https://medmanageuw.ngrok.app';

port.on('data', (data) => {
    console.log(`Received data: ${data}`);
    confirmedObject.confirmed = true;
    confirm_post();
});


function confirm_post() {
    axios({
        method: 'post' ,
        url: site_url ,
        data: {
            // medicationId: 123 ,
            // compartmentId: 1 ,
            success: true
            // message: 'test' ,
        }
    })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error(error);
    });
}

module.exports = confirmedObject;