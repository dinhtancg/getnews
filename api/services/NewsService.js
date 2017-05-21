module.exports = {

  getNewsById: function(id, callback) {
    console.log(id);
    async.auto({
      data: function(next) {
        News.findOne({id: id}, next);
      },
      
    }, function(err, ret) {
      if (err) {
        callback(err);
        return;
      }
      callback(null, ret.data);
    });
  }

}
