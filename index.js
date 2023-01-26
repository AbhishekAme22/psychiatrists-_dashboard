const express = require("express");
const fs = require('fs');

const app = express();
const port = 3000;
const path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "phy"
});

connection.connect();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (!fs.existsSync('uploads')) {
        // If it doesn't exist, create it
        fs.mkdirSync('uploads');
      }
    cb(null, 'uploads/');
   
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  function validatePhoneNumber(phone) {
    const re = /^\+[1-9]\d{1,14}$/;
    return re.test(phone);
  }
  
  function validatePassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,15}$/;
    return re.test(password);
  }
  
  app.get('/', function(request, response) {

	response.sendFile(path.join(__dirname + '/index.html'));
});
app.post("/patient", upload.single('photo'), (req, res) => {
    console.log(req.body);
    const { name, address, email, phone, password ,psychiatrist_id } = req.body;
    const photo = req.file.path;

    if (!name || !address || !email || !password || !photo || !psychiatrist_id) {
        console.log(req.body.name);
      return res.status(400).json({ error: "All fields are mandatory" });
    
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    if (!validatePhoneNumber(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ error: "Invalid password" });
    }
    // Insert the new patient into the database
    connection.query(
      "INSERT INTO patients (name, address, email, phone_number, password, photo,psychiatrist_id) VALUES (?, ?, ?, ?, ?, ?,?)",
      [name, address, email, phone, password, photo,psychiatrist_id],
      (error, results) => {
        if (error) {
          return res.status(500).json({ error });
        }
        return res.json({ message: "Patient registered successfully" });
      }
    );
  });

  app.get("/psychiatrists/:hospitalId", (req, res) => {
    const { hospitalId } = req.params;
    console.log(hospitalId)
    connection.query(
      `SELECT h.name as hospital_name, COUNT(DISTINCT ps.id) as total_psychiatrist, COUNT(DISTINCT p.id) as total_patients, ps.id as psychiatrist_id, ps.name as psychiatrist_name, COUNT(p.id) as patients_count
      FROM hospitals h 
      JOIN psychiatrists ps on h.id = ps.hospital_id
      JOIN patients p on ps.id = p.psychiatrist_id
      WHERE h.id = ?
      GROUP BY ps.id`,
      [hospitalId],
      (error, results) => {
        if(results.length > 0){
            return res.json({
              hospital_name: results[0].hospital_name,
              total_psychiatrist: results[0].total_psychiatrist,
              total_patients: results[0].total_patients,
              psychiatrists: results
            });
          }else{
            return res.status(404).json({ error: "No data found for the given hospital id"});
          }
          
      }
    );
  });
  