"use strict";

const { SerialPort } = require('serialport');
//const Readline = require('@serialport/parser-readline');
const axios = require('axios');
const axiosRetry = require('axios-retry');

const serialPort = new SerialPort({
    path: '/dev/ttyACM0',
    baudRate: 9600
  })
//const parser = new ReadlineParser();
//port.pipe(parser);

axiosRetry(axios, {
    retries: 3 ,
    retryDelay: axiosRetry.exponentialDelay
});

const site_url = 'https://api.medmanageuw.com:3000/confirmTaken';

serialPort.on('data', async (data) => {
    console.log(`Received data: ${data}`);

    const db = await DBConnection();
    const medications = await db.all("SELECT medicationId FROM dispenses WHERE confirmed=?;", [0]);
    const medicationIds = [];
    medications.forEach((row) => {
      medicationIds.push(row.medicationId);
    });
    console.log(`medicationIds: ${medicationIds}`);
    confirm_post(medicationIds);

    // const confirm = await db.get("SELECT value FROM variables WHERE variable=?;", ["confirm"]);
    // console.log(`confirm: ${confirm.value}`);
    // if (confirm.value == 0) {
    //   await db.run("UPDATE variables SET value=? WHERE variable=?;", [1, "confirm"]);
    //   await db.close();
    //   confirm_post();
    // }

});

function confirm_post(medicationIds) {
    axios({
        method: 'post' ,
        url: site_url ,
        data: {
            success: true,
            patientId: 2,
            medicationIds: medicationIds
        }
    })
    .then(async (response) => {
        if (response.status === 200) {
          const db = await DBConnection();
          await db.run("UPDATE dispenses SET confirmed=? WHERE confirmed=?;", [1, 0]);
        }
        console.log(response);
    })
    .catch((error) => {
        console.error(error);
    });
}



const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const { spawn } = require("child_process");

const hostname = "localhost";
const port = 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


// app.post("/confirm", async (req, res) => {
//   try {
//     const db = await DBConnection();
//     const medications = await db.all("SELECT medicationId FROM dispenses WHERE confirmed=?;", [0]);
//     const medicationIds = [];
//     medications.forEach((row) => {
//       medicationIds.push(row.medicationId);
//     });
//     console.log(`medicationIds: ${medicationIds}`);
//     await db.run("UPDATE dispenses SET confirmed=? WHERE confirmed=?;", [1, 0]);
//     await db.close();
//     res.status(200).json({ success: true,
//                             patientId: 2,
//                             medicationIds: medicationIds });
//   } catch (error) {
//     res.status(500).json({ success: false,
//                            message: "An error occurred on the server." });
//   }
// });

// assign medications to a compartment
// app.post("/assign", async (req, res) => {
//   try {
//     const medicationId = req.body.medicationId;
//     const compartmentId = req.body.compartmentId;
//     const quantity = req.body.quantity;

//     console.log(`medicationId: ${medicationId}`);
//     console.log(`compartmentId: ${compartmentId}`);
//     console.log(`quantity: ${quantity}`);

//     if (!medicationId || !compartmentId || !quantity) {
//       res.status(400).json({ success: false,
//                              message: "Missing one or more required params." });
//       return;
//     }

//     if (medicationId.length != compartmentId.length || compartmentId.length != quantity.length) {
//       res.status(400).json({ success: false,
//                              message: "The number of medicationId, compartmentId, and quantity should be equal." });
//       return;
//     }

//     for (let i = 0; i < compartmentId.length; i++) {
//       if (compartmentId[i] != 1 && compartmentId[i] != 2 && compartmentId[i] != 3 && compartmentId[i] != 4) {
//         res.status(400).json({ success: false,
//                                message: "CompartmentId must be 1, 2, 3, or 4." });
//         return;
//       }
//     }

//     const db = await DBConnection();

//     for (let i = 0; i < medicationId.length; i++) {
//       let assignQry = "UPDATE medications SET medication_id=?, quantity=? WHERE compartment_num=?";
//       await db.run(assignQry, [medicationId[i], quantity[i], compartmentId[i]]);
//     }

//     await db.close();

//     res.status(200).json({ medicationId: medicationId,
//                            compartmentId: compartmentId,
//                            quantity: quantity,
//                            success: true,
//                            message: "Successfully assigned medications." });

//   } catch (error) {
//     res.status(500).json({ success: false,
//                            message: "An error occurred on the server while assigning medications." });
//   }
// });

// dispense a medication with the specified quantity
app.post("/dispense", async (req, res) => {
  try {
    const db = await DBConnection();
    // const confirm = await db.get("SELECT value FROM variables WHERE variable=?;", ["confirm"]);
    // console.log("confirm: " + confirm.value);
    // if (confirm.value == 0) {
    //   res.status(400).json({ success: false,
    //                          message: "Haven't received confirmation yet" });
    //   return;
    // }

    const compartmentId = req.body.compartmentId;
    const medicationId = req.body.medicationId;
    const quantity = req.body.quantity;
    console.log(`compartmentId: ${compartmentId}`);
    console.log(`medicationId: ${medicationId}`);
    console.log(`quantity: ${quantity}`);

    if (!compartmentId || !medicationId || !quantity) {
      res.status(400).json({ success: false,
                             message: "Missing one or more required params." });
      return;
    }

    let arg = "";
    for (let i = 0; i < compartmentId.length; i++) {
      if (compartmentId[i] != 1 && compartmentId[i] != 2 && compartmentId[i] != 3 && compartmentId[i] != 4) {
        res.status(400).json({ success: false,
                               message: "CompartmentId must be 1, 2, 3, or 4." });
        return;
      }
      arg += compartmentId[i] + " " + quantity[i] + " ";
    }
    console.log(`arg: ${arg}`);

    const pythonProcess = spawn("python3", ["/home/ubuntu/MedManage/server_script.py", arg]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(400).json({ success: false,
                             message: "There is a problem with the dispenser." });
    });

    pythonProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

    // await db.run("UPDATE variables SET value=? WHERE variable=?;", [0, "confirm"]);

    await db.run("INSERT INTO dispenses (medicationId, confirmed) VALUES (?, ?);", [medicationId[0], 0]);

    res.status(200).json({ success: true,
                           message: "Successfully dispensed medications." });

  } catch (error) {
    res.status(500).json({ success: false,
                           message: "An error occurred on the server while dispensing medications." });
  }
});

// refill a medication with the specified quantity
// app.post("/refill", async (req, res) => {
//   try {
//     const medicationId = req.body.medicationId;
//     const quantity = req.body.quantity;

//     console.log(`medicationId: ${medicationId}`);
//     console.log(`quantity: ${quantity}`);

//     if (!medicationId || !quantity) {
//       res.status(400).json({ success: false,
//                              message: "Missing one or more required params." });
//       return;
//     }

//     if (medicationId.length != quantity.length) {
//       res.status(400).json({ success: false,
//                              message: "The number of medicationId and quantity should be equal." });
//       return;
//     }

//     const db = await DBConnection();
//     let newQuantity = [];

//     for (let i = 0; i < medicationId.length; i++) {
//       let getInfoQry = "SELECT quantity FROM medications WHERE medication_id=?";
//       let info = await db.get(getInfoQry, [medicationId[i]]);

//       if (!info) {
//         res.status(400).json({ success: false,
//                                message: `MedicationId ${medicationId[i]} is not found in the dispenser.` });
//         return;
//       }

//       let refillQry = "UPDATE medications SET quantity=? WHERE medication_id=?";
//       await db.run(refillQry, [parseInt(info.quantity) + parseInt(quantity[i]), medicationId[i]]);

//       info = await db.get(getInfoQry, [medicationId[i]]);
//       newQuantity.push(parseInt(info.quantity));
//     }

//     await db.close();

//     res.status(200).json({ medicationId: medicationId,
//                            newQuantity: newQuantity,
//                            success: true,
//                            message: "Successfully refilled medications." });

//   } catch (error) {
//     res.status(500).json({ success: false,
//                            message: "An error occurred on the server while refilling medications." });
//   }
// });

async function DBConnection() {
  const db = await sqlite.open({
    filename: "database.db",
    driver: sqlite3.Database
  });
  return db;
}

app.listen(port, hostname, () => {
  console.log(`Server running on http://${hostname}:${port}/`);
});