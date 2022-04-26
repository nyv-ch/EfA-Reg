var express = require("express");
const res = require("express/lib/response");
var router = express.Router();
const translatte = require("translatte");
const { form } = require("../translations");
const jwt = require('jsonwebtoken')

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
  var lang = req.query.lang;
  if (!lang_array.includes(lang)) return res.redirect("/");
  return res.render("form", { text: form[0][lang] });
});

router.post('/qr', function(req, res, next){
  var data = req.body;
  const token = jwt.sign(data, process.env.jwt_secret, {expiresIn: '5h'})
  return res.render('/qr', {jwt: token})
})

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