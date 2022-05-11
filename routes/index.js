var express = require("express");
const res = require("express/lib/response");
var router = express.Router();
const translatte = require("translatte");
const {
  form
} = require("../translations");
require("dotenv").config();
var mysql = require('mysql2');
const {
  all_plz
} = require("../plz_schweiz");
const nodeCron = require("node-cron");


var db = mysql.createConnection({
  connectionLimit: 500,
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.db,
  port: process.env.portt,
  insecureAuth: true
});

router.all('/*', function(req, res, next){
  var myDate = new Date();/*
  if (myDate.getDay() !== 6) {
    res.redirect("https://www.essenfueralle.org")
  }else{
    if(myDate.getHours() < 9 || myDate.getHours() > 19){
      res.redirect("https://www.essenfueralle.org")
    }else{
      next()
    }
  };*/
})
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Express"
  });
});

async function translate(text, lang) {
  return new Promise((resolve, reject) => {
    translatte(text, {
        to: lang
      })
      .then((response) => {
        var text = response.text;
        resolve(text);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

router.get("/form", function (req, res, next) {
  var lang_array = ["en", "uk", "de", "fr", "ku", "ar", "fa", "es"];
  var lang = req.query.lang;
  if (!lang_array.includes(lang)) return res.redirect("/");
  return res.render("form", {
    text: form[0][lang]
  });
});

router.post('/qr', function (req, res, next) {
  var success = false
  all_plz.forEach(element => {
    if (req.body.house == element.plz + " - " + element.ort + " - " + element.kanton) success = true;
  });
  if (success !== true) return res.json({
    success: false,
    error: "addr"
  })
  var name = req.body.name;
  var data = Buffer.from(JSON.stringify(req.body)).toString('base64');
  //decode
  //Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('ascii')
  db.query("SELECT * FROM pre_reg WHERE data = ?;", [data], function (error, results, fields) {
    if (results.length > 0) return res.json({
      success: true,
      jwt: "pre_"+results[0].id,
      name: name
    })
    db.query("SELECT * FROM pre_reg WHERE tel = ?;", [req.body.phone], function (error, results, fields) {
      if (results.length > 0) return res.json({
        success: false,
        error: "phone"
      })
    db.query("INSERT INTO pre_reg (data, tel) VALUES (?, ?)", [data, req.body.phone], function (error, results, fields) {
      return res.json({
        success: true,
        jwt: "pre_"+results.insertId,
        name: name
      })
    })
  })
  })
})

router.get("/qr/:id", function (req, res, next) {
  return res.render("qr", {
    jwt: req.params.id,
    name: req.query.name
  });
});

nodeCron.schedule(" */15 * * * *", () => {
  db.query("SELECT 1", function (error, results, fields) {
    console.log("heartbeat")
  })
});


module.exports = router;

//to add new languag:
/*text_array.forEach((element) => {
    translate(element.text, lang).then((result) => {
      element.text = result;
      text.push(result)
      console.log(text_array)
      if (text.length == 11) return
    });
  });
*/
