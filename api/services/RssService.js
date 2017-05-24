
// core modules
var fs = require('fs');
var url = require('url');

//third party modules
var Feed = require('rss-to-json');
var request = require('request');
var cheerio = require('cheerio');
var redis = require("redis"),
    client = redis.createClient(
    	{
    		host: 'localhost',
    		port : 6379
    	});

module.exports = {
	
	//lấy link từ Rss feeds pages
	scrape : function(dataUrl, callback){
		async.auto({
			getlinks: function(next){
				//Lấy dữ liệu
			    Feed.load(dataUrl.url, function(err, rss){
			      		    
				_.forEach(rss.items, function (item){ 
					var img;
					var str = item.description;
					if (str.includes("24h.com.vn")){
						img = str.substring(str.indexOf("<img") ,str.indexOf("' alt"));
						img = img.replace("<img width='130' height='100' src='","");
					}
					else if (str.includes("vnexpress.net")) {
						img = str.substring(str.indexOf("<img width") ,str.indexOf("</a>"));
						img = img.replace('<img width=130 height=100 src="','');
						img = img.replace('_180x108', '');
						img = img.replace('" >','');
					
   					}else{
						img = str.substring(str.indexOf("<img") ,(str.indexOf('" />')+4));

						if(str.includes("dantri.com")){
    						img = img.replace('/zoom/80_50','');
    						img = img.replace('<img src="','');
    						img = img.replace('" />','');
    						str = item.title;
    					}
    					if (img.includes("imgs.vietnamnet.vn")) {
    						img = img.replace('?w=220', '');
    						img = img.replace('<img src="','');
    						img = img.replace('" />','');
    					}
					}   					
					var obj;
					request(item.link, function(error, response, html){
				        if(!error){
				        	console.log(item.link);
				            var $ = cheerio.load(html);
				            if (item.link.includes("dantri.com")) {
				            	$('#divNewsContent').filter(function(){
				                	var data = $(this);
				                	var content = data.toString();
				                	obj = {
						            	title: item.title,
						            	link: item.link,
						            	content: content,
						            	img : img,
						            	category_name: dataUrl.title
						            }
				            	});
				            }
				            if (item.link.includes("vnexpress.net")) {
				            	$('.fck_detail width_common block_ads_connect').filter(function(){
				                	var data = $(this);
				                	var content = data.toString();
				                	obj = {
						            	title: item.title,
						            	link: item.link,
						            	content: content,
						            	img : img,
						            	category_name: dataUrl.title
						            }
				            	});
				            }
				            if (item.link.includes("24h.com.vn")) {
				            	$('.text-conent').filter(function(){
				                	var data = $(this);
				                	var content = data.toString();
				                	
				                	obj = {
						            	title: item.title,
						            	link: item.link,
						            	content: content,
						            	img : img,
						            	category_name: dataUrl.title
						            }
				            	});
				            }
				            if (item.link.includes("vietnamnet.vn")) {
				            	$('.ArticleContent').filter(function(){
				                	var data = $(this);
				                	var content = data.toString();
				                	
				                	obj = {
						            	title: item.title,
						            	link: item.link,
						            	content: content,
						            	img : img,
						            	category_name: dataUrl.title
						            }
						           	
				            	});
				            }

				            News.findOrCreate(obj).exec(function (err,record) {
								if (err) return err;
								var abc = {
									id:record.id,
									title : record.title
									}

								client.on("error", function (err) {
								    console.log("Error " + err);
								});

								 
								client.set(record.title, record.id, redis.print);
							});

							
				        }
					
					});						
	 			})
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

