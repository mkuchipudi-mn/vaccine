var db = require("../config/mongoclient");
var mongo = require("mongoose");
var express = require("express");
var router = express.Router();

var Schema = mongo.Schema;

var UsersSchema = new Schema(
  {
    vaccine_Name: { type: String },
    vaccine_Description: { type: String },
    vaccine_Purpose: { type: String },
    vaccine_Usedge: { type: String },
    vaccine_Brand: { type: String },
    vaccine_Created_Date: { type: String },
    vaccine_Updated_Date: { type: String },
  },
  { versionKey: false }
);

var model = mongo.model("vaccine", UsersSchema, "vaccine");

router.post("/save", function (req, res) {
  var mod = new model(req.body);
  if (req.body.mode == "Save") {
    mod.save(function (err, data) {
      if (err) {
        res.send(err);
      } else {
        res.send({ data: "Record has been Inserted..!!" });
      }
    });
  } else {
    model.findByIdAndUpdate(
      req.body.id,
      { name: req.body.name, address: req.body.address },
      function (err, data) {
        if (err) {
          res.send(err);
        } else {
          res.send({ data: "Record has been Updated..!!" });
        }
      }
    );
  }
});

router.get("/get_Vaccine", function (req, res) {
  console.log(req.query.id);
  const body = req.query.id ? { _id: req.query.id } : {};

  model.find(body, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

router.post("/delete", function (req, res) {
  model.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send({ data: "Record has been Deleted..!!" });
    }
  });
});

module.exports = router;
