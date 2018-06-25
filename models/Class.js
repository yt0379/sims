var keystone = require('keystone');
var Types = keystone.Field.Types;
var Class = new keystone.List('Class');

Class.add({
	name: { type: Types.Text, required: true, index: true },

});

Class.relationship({ ref: 'User', path: 'users', refPath: 'clazz' });

Class.defaultColumns = 'name';
Class.register();
