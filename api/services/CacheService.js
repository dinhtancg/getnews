var redis = require("redis"),
    db = redis.createClient();

module.exports = {

	cache: function (id, title) {
		
		var toCache ={id: id, title: title};

		sails.getDatastore('cache').leaseConnection(function during(db, proceed) {

		  db.get(toCache, function (err, cachedData){
		    if (err) { return proceed(err); }

		    var cachedProducts;
		    try {
		      cachedProducts = JSON.parse(cachedData);
		    } catch (e) { return proceed(e); }

		    if (cachedProducts) {
		      return proceed(undefined, cachedProducts);
		    }

		    var newlyCachedProducts = [ /* ... */ ];

		    // Finally, when finished:
		    return proceed(undefined, newlyCachedProducts);

		  });//</ .get() >

		}).exec(function (err, products){
		  if (err) { return res.serverError(err); }

		  return res.json(products);

		});
	}
}