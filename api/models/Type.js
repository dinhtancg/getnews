/**
* Type.js
*
* @description :: This model holds the Type details.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		type_name: {
			type:'string',
			unique : true
		},
		category_id:{
			type : 'string',
			unique: true
		}
	}
};
