/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  	getData : function(req, res){
  		var urls ="http://vnexpress.net/tin-tuc/thoi-su";

  		async.auto({
	  		data : function (next) {
	  			NewsService.scrape(urls, next);
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
  	}
}
