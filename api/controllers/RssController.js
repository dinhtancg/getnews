/**
 * RssController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getData : function(req, res){
      var urls =["http://dantri.com.vn/suc-khoe.rss","http://dantri.com.vn/xa-hoi.rss", "http://dantri.com.vn/giai-tri.rss", "http://dantri.com.vn/giao-duc-khuyen-hoc.rss", "http://dantri.com.vn/the-thao.rss", "http://dantri.com.vn/the-gioi.rss", "http://dantri.com.vn/kinh-doanh.rss", "http://dantri.com.vn/o-to-xe-may.rss", "http://dantri.com.vn/suc-manh-so.rss"];

      async.auto({
        data : function (next) {
          _.forEach(urls, function(url){
            RssService.scrape(url);
          });
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
    },
}
