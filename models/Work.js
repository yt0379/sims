// 导入keystone模块
var keystone = require('keystone');
// 字段类型枚举对象
var Types = keystone.Field.Types;

// 创建Work模型
var Work = new keystone.List('Work');

// 添加字段
Work.add({
	name: { type: Types.Text, initial: true },
	img: { type: Types.Text, initial: true },
	user: { type: Types.Relationship, ref: 'User', many: false, initial: true },
	createdAt: { type: Types.Datetime, default: new Date(), note: '可不填，设置为当前时间', initial: true },
});

// 设置admin ui中显示字段
Work.defaultColumns = 'img,user,createdAt';

// 注册
Work.register();
