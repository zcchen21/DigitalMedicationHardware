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

    if (!medicationId || !compartmentId || !quantity) {
      res.status(400).send("Missing one or more required params.");
      return;
    }

    console.log(`medicationId: ${medicationId}`);
    console.log(`compartmentId: ${compartmentId}`);
    console.log(`quantity: ${quantity}`);

    const db = await DBConnection();
    let assignQry = "UPDATE medications SET medication_id=?, quantity=? WHERE compartment_num=?";
    await db.run(assignQry, [medicationId, quantity, compartmentId]);
    await db.close();

    res.status(200).json({ medicationId: medicationId,
                           compartmentId: compartmentId,
                           success: true,
                           message: "Successfully assigned medication." });

  } catch (error) {
    res.status(500).json("An error occurred on the server while assigning medication.");
  }
});

// dispense a medication with the specified quantity
app.post("/dispense", async (req, res) => {
  try {
    if (!req.body.medication_id || !req.body.quantity) {
      res.status(400).json("Missing one or more required params.");
      return;
    }

    const medication_id = req.body.medication_id.trim();
    const quantity = req.body.quantity.trim();

    console.log(`medication_id: ${medication_id}`);
    console.log(`quantity: ${quantity}`);

    const db = await DBConnection();
    const quantityQry = "SELECT quantity FROM medications WHERE medication_id=?";
    const quantityAvailable = await db.get(quantityQry, [medication_id]);

    console.log(`quantityAvailable: ${quantityAvailable}`);

    if (quantityAvailable.length === 0) {
      await db.close();
      res.status(400).json("Dispense failed. Medication ID couldn't be found in the dispenser.");
    }

    if (quantityAvailable < quantity) {
      await db.close();
      res.status(400).json("Dispense failed. Not enough pills left");
    }

    const arg = medication_id + " " + quantity;
    console.log(`arg: ${arg}`);

    const pythonProcess = spawn("python3", ["/home/ubuntu/demo_script.py", arg]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(400).json("Dispense failed. There's a problem with the dispenser.");
    });

    pythonProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

    const updateQry = "UPDATE medications SET quantity=? WHERE medication_id=?";
    await db.run(updateQry, [quantityAvailable - quantity, medication_id]);
    await db.close();
    res.status(200).json("Dispense succeeded.");

  } catch (error) {
    res.status(500).json("An error occurred on the server. Try again later.");
  }
});

// refill a medication with the specified quantity
app.post("/refill", async (req, res) => {
  try {
    if (!req.body.medication_id || !req.body.quantity) {
      res.status(400).json("Missing one or more required params.");
      return;
    }

    const medication_id = req.body.medication_id.trim();
    const quantity = req.body.quantity.trim();

    console.log(`medication_id: ${medication_id}`);
    console.log(`quantity: ${quantity}`);



  } catch (error) {
    res.status(500).json("An error occurred on the server. Try again later.");
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