"use strict";

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

// assign medications to a compartment
app.post("/assign", async (req, res) => {
  try {
    const medicationId = req.body.medicationId;
    const compartmentId = req.body.compartmentId;
    const quantity = req.body.quantity;

    console.log(`medicationId: ${medicationId}`);
    console.log(`compartmentId: ${compartmentId}`);
    console.log(`quantity: ${quantity}`);

    if (!medicationId || !compartmentId || !quantity) {
      res.status(400).json({ success: false,
                             message: "Missing one or more required params." });
      return;
    }

    if (medicationId.length != compartmentId.length || compartmentId.length != quantity.length) {
      res.status(400).json({ success: false,
                             message: "The number of medicationId, compartmentId, and quantity should be equal." });
      return;
    }

    for (let i = 0; i < compartmentId.length; i++) {
      if (compartmentId[i] != 1 && compartmentId[i] != 2 && compartmentId[i] != 3 && compartmentId[i] != 4) {
        res.status(400).json({ success: false,
                               message: "CompartmentId must be 1, 2, 3, or 4." });
        return;
      }
    }

    const db = await DBConnection();

    for (let i = 0; i < medicationId.length; i++) {
      let assignQry = "UPDATE medications SET medication_id=?, quantity=? WHERE compartment_num=?";
      await db.run(assignQry, [medicationId[i], quantity[i], compartmentId[i]]);
    }

    await db.close();

    res.status(200).json({ medicationId: medicationId,
                           compartmentId: compartmentId,
                           quantity: quantity,
                           success: true,
                           message: "Successfully assigned medications." });

  } catch (error) {
    res.status(500).json({ success: false,
                           message: "An error occurred on the server while assigning medications." });
  }
});

// dispense a medication with the specified quantity
app.post("/dispense", async (req, res) => {
  try {
    const medicationId = req.body.medicationId;
    const quantity = req.body.quantity;

    console.log(`medicationId: ${medicationId}`);
    console.log(`quantity: ${quantity}`);

    if (!medicationId || !quantity) {
      res.status(400).json({ success: false,
                             message: "Missing one or more required params." });
      return;
    }

    if (medicationId.length != quantity.length) {
      res.status(400).json({ success: false,
                             message: "The number of medicationId and quantity should be equal." });
      return;
    }

    const db = await DBConnection();
    let arg = "";
    let quantityAvailable = [];

    const quantityQry = "SELECT quantity FROM medications WHERE medication_id=?";

    for (let i = 0; i < medicationId.length; i++) {
      let info = await db.get(quantityQry, [medicationId[i]]);

      if (!info) {
        res.status(400).json({ success: false,
                               message: `MedicationId ${medicationId[i]} is not found in the dispenser.` });
        return;
      }

      if (parseInt(info.quantity) < parseInt(quantity)) {
        res.status(400).json({ success: false,
                               message: `Not enough pills left for medicationId ${medicationId[i]}. Requesting for ${quantity[i]}, but only ${info.quantity} is available.` });
        return;
      }

      quantityAvailable.push(info.quantity);
      arg += medicationId[i] + " " + quantity[i] + " ";
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

    const updateQry = "UPDATE medications SET quantity=? WHERE medication_id=?";

    for (let i = 0; i < medicationId.length; i++) {
      await db.run(updateQry, [parseInt(quantityAvailable[i]) - parseInt(quantity[i]), medicationId[i]]);
      quantityAvailable[i] = parseInt(quantityAvailable[i]) - parseInt(quantity[i]);
    }

    await db.close();

    res.status(200).json({ medicationId: medicationId,
                           newQuantity: quantityAvailable,
                           success: true,
                           message: "Successfully dispensed medications." });

  } catch (error) {
    res.status(500).json({ success: false,
                           message: "An error occurred on the server while dispensing medications." });
  }
});

// refill a medication with the specified quantity
app.post("/refill", async (req, res) => {
  try {
    const medicationId = req.body.medicationId;
    const quantity = req.body.quantity;

    console.log(`medicationId: ${medicationId}`);
    console.log(`quantity: ${quantity}`);

    if (!medicationId || !quantity) {
      res.status(400).json({ success: false,
                             message: "Missing one or more required params." });
      return;
    }

    if (medicationId.length != quantity.length) {
      res.status(400).json({ success: false,
                             message: "The number of medicationId and quantity should be equal." });
      return;
    }

    const db = await DBConnection();
    let newQuantity = [];

    for (let i = 0; i < medicationId.length; i++) {
      let getInfoQry = "SELECT quantity FROM medications WHERE medication_id=?";
      let info = await db.get(getInfoQry, [medicationId[i]]);

      if (!info) {
        res.status(400).json({ success: false,
                               message: `MedicationId ${medicationId[i]} is not found in the dispenser.` });
        return;
      }

      let refillQry = "UPDATE medications SET quantity=? WHERE medication_id=?";
      await db.run(refillQry, [parseInt(info.quantity) + parseInt(quantity[i]), medicationId[i]]);

      info = await db.get(getInfoQry, [medicationId[i]]);
      newQuantity.push(parseInt(info.quantity));
    }

    await db.close();

    res.status(200).json({ medicationId: medicationId,
                           newQuantity: newQuantity,
                           success: true,
                           message: "Successfully refilled medications." });

  } catch (error) {
    res.status(500).json({ success: false,
                           message: "An error occurred on the server while refilling medications." });
  }
});

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