
// core modules
var fs = require('fs');
var url = require('url');

//third party modules
var Feed = require('rss-to-json');
var request = require('request');
var cheerio = require('cheerio');

module.exports = {

	//lấy tin từ Rss feeds pages
	scrape : function(url, callback){
		console.log(url);
		async.auto({
		    getNews: function(next){

		    	//Lấy dữ liệu
			    Feed.load(url, function(err, rss){
    				_.forEach(rss.items, function (item){

    					var obj = {
    						title: item.title,
    						description: item.description,
    						link: item.link,
    						source: rss.title,
    					};
    					// ghi vào DB nếu trùng thì k nhận.
    					News.findOrCreate(obj).exec(function (err,record) {
							if (err)
							  	res.json({error:err});
		          
								console.log(record); 
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

