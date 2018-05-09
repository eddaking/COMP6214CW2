module.exports = {
   getPoints: function (long,lat,dist){
    var url = "mongodb://localhost:27017/";
    var dbname = 'mydb';
    var MongoClient = require('mongodb').MongoClient
      , Server = require('mongodb').Server;

    MongoClient.connect(url+dbname, {native_parser:true}, function(err, db) {
          if (err) throw err;
          var dbo = db.db("mydb")
          var query = { geocode : { $near : [ long, lat], $maxDistance: dist} }
          var cursor = dbo.collection('things').find(query)
          .toArray(function(err, result) {
                  if (err) throw err;
                  console.log(result);
                  });

          db.close();
        });
  }
};
