// 导入keystone模块
var keystone = require('keystone');
// 字段类型枚举对象
var Types = keystone.Field.Types;

// History
var History = new keystone.List('History');

// 添加字段
History.add({
	content: { type: Types.Text, initial: true },
	user: { type: Types.Relationship, ref: 'User', many: false, initial: true },
	createdAt: { type: Types.Datetime, default: new Date(), note: '可不填，设置为当前时间', initial: true },
});

// 设置admin ui中显示字段
History.defaultColumns = 'content,user,createdAt';

// 注册
History.register();
