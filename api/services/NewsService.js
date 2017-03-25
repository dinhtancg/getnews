var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

module.exports = {
	scrape : function(url, callback){
		console.log(url);
		async.auto({
		    getnews : function(next){
		     	request(url, function(error, response, body) {
				  	if(error) {
				    	console.log("Error: " + error);
				  	}
					 console.log("Status code: " + response.statusCode);

					 var $ = cheerio.load(body);
				
					$('.list_news > li').each(function( index ) {
					    var title = $(this).find('.title_news > a').text().trim();
					    var link = $(this).find('.title_news > a').attr('href');
					    var news_lead = $(this).find('.news_lead').text().trim();
					    var obj = {
					    	title : title,
					    	url : link,
					    	news_lead : news_lead
					    };
					    console.log(obj);
					    console.log("=="+url+"===");
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
