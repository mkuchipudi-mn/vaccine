var db = require("../config/mongoclient");
var mongo = require("mongoose");
var express = require("express");
var router = express.Router();

var Schema = mongo.Schema;

var UsersSchema = new Schema(
  {
    vaccineName: { type: String },
    vaccineDescription: { type: String },
    vaccinePurpose: { type: String },
    vaccineUsedge: { type: String },
    vaccineBrand: { type: String },
    vaccineStartDate: { type: Date },
    vaccinendDate: { type: Date },
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
    model.findByIdAndUpdate(req.body.id, function (err, data) {
      if (err) {
        res.send(err);
      } else {
        res.send({ data: "Record has been Updated..!!" });
      }
    });
  }
});

router.put("/save", function (req, res, next) {
  console.log(req.body);
  model.findByIdAndUpdate(req.body.id, req.body, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send({ data: "Record has been Updated..!!" });
    }
  });
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
