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
    start: function () {
     this.getData();
    },
}
