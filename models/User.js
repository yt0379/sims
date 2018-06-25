var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Text, index: true },
	email: {
		type: Types.Email, initial: true,
		note: '可为空，根据电话号码自动生成',
		watch: 'tel', value: function () {
			if (this.email) {
				return this.email;
			}
			if (this.tel) {
				return this.tel + '@keystonejs.com';
			}
			return '';
		},
	},
	tel: { type: Types.Text, initial: true },
	age: { type: Types.Number },
	password: { type: Types.Password, initial: true, required: true },
	score: { type: Types.Number, initial: true, required: true, default: 0 },
	clazz: { type: Types.Relationship, ref: 'Class', many: false, initial: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

User.relationship({ ref: 'Work', path: 'works', refPath: 'user' });

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
