const express = require('express');
const app = express.Router();
const mongoose = require('mongoose');

//define scheme
var userSchema = mongoose.Schema({
      addr : String,
      name : String,
      price : Number,
      inventory : Number
});

var User = mongoose.model('yososu',userSchema);
// create model with mongodb collection & scheme


app.get('/list', function(req, res, next) {
      User.find({},function(err,docs){
        if(err) console.log('err');
            res.send(docs);
      });
});
app.get("/api/finds",(req,res) => {
  const addr = req.query.addr;
  User.find({'addr' :{$regex:addr}}).select('addr name price inventory').exec(function(err,docs){
    if(err) console.log('err');
          res.send(docs);
  })
});

app.post("/api/find/addr",(req,res) => {
  const addr = req.body.addr;
  User.find({'addr' :{$regex:addr}}).select('addr name price inventory').exec(function(err,docs){
    if(err) console.log('err');
            res.send(docs);
  })
});

module.exports = app;
