/**
* Category.js
*
* @description :: This model holds the Category details.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		category_name: {
			type:'string',
			unique : true
		},
	}
};
