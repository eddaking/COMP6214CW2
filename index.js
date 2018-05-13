const express = require('express');
const app = express();
var path = require('path');
var public = path.join(__dirname, 'public');
var MongoClient = require('mongodb').MongoClient
  , Server = require('mongodb').Server;

// const getPoints = require('getPoints');

function getConnection(dbname){
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url+dbname, {native_parser:true}, function(err, db) {
          if (err) throw err;
          dbo = db.db(dbname)
          // return dbo.collection('pricesdata')
          // var query = { geocode : { $near : [ long, lat], $maxDistance: dist} }
          // var cursor = dbo.collection('things').find(query)
          // .toArray(function(err, result) {
          //         if (err) throw err;
          //         console.log(result);
          //         });
          //
          // db.close();
        });
}

var dbo = getConnection('mydb');
var getPoints = function(param, cb) {

        console.log(param.lat, param.long, param.dist);
        var query =
        {
          geocode:
          {
            $near: [Number(param.lat) ,Number(param.long)],
            $maxDistance : Number(param.dist)
          }
        };
        dbo.collection('things').find(query).toArray(cb);
    }

// app.use('/', express.static(__dirname + '/index2.html'));

app.get('/getPoints', function(req,res){
  getPoints(req.query, function(err,data){
    if(err) throw err;
    return res.json(data);
  })
  // res.send(getPoints(req.query.BusinessType,'things'))
})


// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(public, 'index.html'));
});

app.use('/', express.static(public));

app.listen(3000, "localhost")
console.log("server is listening om localhost")
