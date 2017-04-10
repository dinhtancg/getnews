var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var Feed = require('rss-to-json');

module.exports = {
	scrape : function(url, callback){
		console.log(url);
		async.auto({
		    getnewsVNN : function(next){
			    Feed.load(url, function(err, rss){
    				_.forEach(rss.items, function (item){
    					var obj = {
    						title: item.title,
    						description : item.description,
    						link : item.link,
    					};
    					News.findOrCreate(obj).exec(function (err,record) {
							if (err)
							  	res.json({error:err});
		          
								console.log(record); // Google
							});
    				});
				});
		  	},
			}, function(err, ret){
				if (err) {
					return callback(err);
				}
				callback(null, ret);
			});

	},	 
}
