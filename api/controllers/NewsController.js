/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var checkit = require('checkit');

 module.exports = {
    getNewsById: function (req, res){
    var [err, params] = new checkit({
      id: ['required', 'string'],
    }).validateSync(req.allParams());

    if (err) {
      res.badRequest(err.toString());
      return;
    }
        async.auto({
        data: function (next) {
          NewsService.getNewsById(params.id, next);
        },
 
      }, function (err, ret) {
        if (err) {
          res.serverError(err);
          return;
        }
        res.ok(ret);
      });
    },
}