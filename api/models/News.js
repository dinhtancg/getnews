/**
* News.js
*
* @description :: This model holds the News details.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

attributes: {
	title: {
		      	type:"string",
		      	unique : true
		},
    url: {
		      	type:"string",
		      	unique : true
		},
    news_lead: {
		      	type:"string",
		}
  }
};
