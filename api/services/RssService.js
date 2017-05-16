
// core modules
var fs = require('fs');
var url = require('url');

//third party modules
var Feed = require('rss-to-json');

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
		console.log(dataUrl);
		async.auto({
		    getNews: function(next){

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
    						description: str,
    						link: item.link,
    						img: img,
    						source: rss.title,
    						category_name: dataUrl.title
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

