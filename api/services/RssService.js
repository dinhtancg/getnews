
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
    					console.log(item.link);
    					var obj = {
    						title: item.title,
    						link: item.link,
    						img: img,
    						source: rss.title,
    						category_name: dataUrl.title
    					};
    					// ghi vào DB nếu trùng thì k nhận.
    					Link.findOrCreate(obj).exec(function (err,record) {
							if (err){
								return err;
								}
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
							            	content: content,
							            	img : item.img,
							            	category_name: item.category_name
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
							            	content: content,
							            	img : item.img,
							            	category_name: item.category_name
							            }
					            	});
					            }
					            if (item.link.includes("24h.com.vn")) {
					            	$('.colCenter').filter(function(){
					                	var data = $(this);
					                	var content = data.children().last().toString();
					                	
					                	tintuc = {
							            	title: item.title,
							            	link: item.link,
							            	content: content,
							            	img : item.img,
							            	category_name: item.category_name
							            }
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

