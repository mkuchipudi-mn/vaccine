var db = require("../config/mongoclient");
var mongo = require("mongoose");
var express = require("express");
var router = express.Router();

var Schema = mongo.Schema;

var UsersSchema = new Schema(
  {
    VaccineName: { type: String },
    Description: { type: String },
    Purpose: { type: String },
    Usedage: { type: String },
    Brand: { type: String },
    Created_Date: { type: String },
    Updated_Date: { type: String },
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

router.post("/delete", function (req, res) {
  model.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send({ data: "Record has been Deleted..!!" });
    }
  });
});

router.get("/findAll", function (req, res) {
  model.find({}, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});

module.exports = router;
