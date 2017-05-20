
// core modules
var fs = require('fs');
var url = require('url');

//third party modules
var Feed = require('rss-to-json');
var request = require('request');
var cheerio = require('cheerio');

module.exports = {
	decodeHtml :function(str)
	{
	    var map =
	    {
	        '&amp;': '&',
	        '&lt;': '<',
	        '&gt;': '>',
	        '&quot;': '"',
	        '&#039;': "'"
	    };
	    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {return map[m];});
	},
	//lấy tin từ Rss feeds pages
	scrape : function(dataUrl, callback){
		async.auto({
			getlinks: function(next){

		    	//Lấy dữ liệu
			    Feed.load(dataUrl.url, function(err, rss){
			    	
    				_.forEach(rss.items, function (item){    					
    					console.log(item.link);
    					var obj = {
    						title: item.title,
    						link: item.link,
    						category_name: dataUrl.title
    					};
    					// ghi vào DB nếu trùng thì k nhận.
    					Link.findOrCreate(obj).exec(function (err,record) {
							if (err){
								return err;
								}
							  	
								console.log(record); 
							});
    				});
				});
		  	},
		  	getnews: function(next) {
		  		Link.find({}).exec(function(err, items){
        			_.forEach(items, function (item) {
        				var tintuc;
        				request(item.link, function(error, response, html){
					        if(!error){
					            var $ = cheerio.load(html);
					            if (item.link.includes("dantri.com")) {
					            	$('#divNewsContent').filter(function(){
					                	var data = $(this);
					                	var content = data.toString();
					                	tintuc = {
							            	title: item.title,
							            	link: item.link,
							            	content: content
							            }
					            	});
					            }
					            if (item.link.includes("vnexpress.net")) {
					            	$('#left_calculator').filter(function(){
					                	var data = $(this);
					                	var content = data.toString();
					                	tintuc = {
							            	title: item.title,
							            	link: item.link,
							            	content: content
							            };
					            	});
					            }
					            if (item.link.includes("24h.com.vn")) {
					            	$('.colCenter').filter(function(){
					                	var data = $(this);
					                	var content = data.children().last().toString();
					                	
					                	tintuc = {
							            	title: item.title,
							            	link: item.link,
							            	content: content
							            };
					            	});
					            }
					            
					            
					    News.findOrCreate(tintuc).exec(function (err,record) {
										if (err){
											return err;
											}
										  	
											//console.log(record); 
										});
								}
							})
		   				 });
			})
		  	},
		}, function(err, ret){
				if (err) {
					return callback(err);
				}
				callback(null, ret);
			});
	}
}

