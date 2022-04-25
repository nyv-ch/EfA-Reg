var express = require("express");
const res = require("express/lib/response");
var router = express.Router();
const translatte = require("translatte");
const { el } = require("translatte/languages");
const { form } = require("../translations");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

async function translate(text, lang) {
  return new Promise((resolve, reject) => {
    translatte(text, { to: lang })
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
var text_array = [
  { order: 0, text: "Essen für Alle" },
  { order: 1, text: "Vorregistration"},
  { order: 2, text:"Bitte benütze das Lateinische Alphabet"},
  { order: 3, text:"Dein Name"},
  { order: 4, text:"Deine Telefonnummer"},
  { order: 5, text:"Dein Aufenthaltsstatus"},
  { order: 6, text:"Mit wie vielen Personen lebst du?"},
  { order: 7, text:"Wo wohnst du?"},
  { order: 8, text:"Bitte wähle einen Ort aus der Liste aus"},
  { order: 9, text:"Dein Geburtsdatum"},
  { order: 10, text:"Absenden"},
  { order: 11, text:"Zurück"},
];
  var lang = req.query.lang;
  if (!lang_array.includes(lang)) return res.redirect("/");

  var text = [];
  /*if(lang == "de") return res.render("form", { text: text_array });
  text_array.forEach((element) => {
    translate(element.text, lang).then((result) => {
      element.text = result;
      text.push(result)
      console.log(text_array)
      if (text.length == 11) return res.render("form", { text: text_array });
    });
  });
*/
return res.render("form", { text: form[0][lang] });

  //translatte('Essen für Alle __ Vorregistration __ Bitte benütze das Lateinische Alphabet __ Dein Name __ Deine Telefonnummer __ Dein Aufenthaltsstatus __ Mit wie vielen Personen lebst du? __ Wo wohnst du? __ Bitte wähle einen Ort aus der Liste aus __ Dein Geburtsdatum __ Absenden __ Zurück', {to: lang}).then(response => {
  //  console.log(response.text);
  //var text = response.text.split("__")
  //}).catch(err => {
  //  console.error(err);
  //});
});

module.exports = router;
