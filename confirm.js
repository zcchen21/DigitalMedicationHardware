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

const site_url = 'https://f909-2601-600-a480-2900-18eb-4ff-fe88-7554.ngrok-free.app';

port.on('data', (data) => {
    console.log(`Received data: ${data}`);
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