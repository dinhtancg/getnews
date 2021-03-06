/**
* News.js
*
* @description :: This model holds the News details.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

attributes: {
	title: {
		type:'string',
		unique : true,
	},

    link: {
		type:'string',
		unique : true,
	},
	content:{
		type: 'string',
		unique : true
	},
	img : {
		type: 'string',
		//required: true,
		unique : true
	},
	category_name: {
		type: 'string',
	}
  }
};
