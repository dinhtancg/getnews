/**
 * RssController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require("fs");
var urls = JSON.parse(fs.readFileSync("urls.json"));

module.exports = {
    getData : function(req, res){

      async.auto({
        data : function (next) {
          _.forEach(urls, function(url){
            var obj = {
              category_name: url.title    
            };
            Category.findOrCreate(obj).exec(function (err,record) {
              if (err)
                  res.json({error:err}); 
                  console.log("Done!!");              
              });
            RssService.scrape(url); 
          });
        },
      }, function (err, ret) {
        if (err) {
          return res.serverError(err);
        }
        res.ok(ret);
      });
    },
}
