"use strict";

const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const hostname = "localhost";
const port = 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.post("/", (req, res) => {
  if (req.body.command) {
    const arg = req.body.command.trim();
    console.log(`arg: ${arg}`);

    const pythonProcess = spawn("python3", ["/home/ubuntu/demo_script.py", arg]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

    res.send("Request received!\n");
  }
  // res.send("Hello World!\n");
});

app.listen(port, hostname, () => {
  console.log(`Server running on http://${hostname}:${port}/`);
});