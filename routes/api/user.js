var keystone = require('keystone');
var User = keystone.list('User');
var Work = keystone.list('Work');
var Class = keystone.list('Class');
var History = keystone.list('History');

exports.login = function (req, res) {
	const tel = req.body.tel;

	User.model.findOne({tel}).exec((err, user) => {
		if (err) {
			return res.apiError('数据查询出错，请重试！');
		}
		if (!user) {
			return res.apiError('您输入的手机号不存在！');
		}
		//登录验证
		keystone.session.signin({email: user.email, password: req.body.pwd},
			req, res,
			() => res.apiResponse({user: {_id: user._id, name: user.name}}),
			() => res.apiError('用户名和密码不匹配！')
		)
	})
}

exports.getUserInfo = function (req, res) {
	const user = req.user;
	if (user) {//已登录
		//查询user相关作品
		Work.model.find({user}, '_id name createdAt', (err, works) => {
			if (err) {
				return res.apiError('查询错误');
			}
			return res.apiResponse({
				userInfo: {
					name: user.name,
					score: user.score,
					works
				}
			});
		})
	} else {
		res.apiNotAllowed('请先登录');
	}
}

exports.getUserList = function (req, res) {
	User.model
		.find({isAdmin: false}) //不是管理员的
		.populate('clazz')
		.select({password: 0, email: 0, isAdmin: 0})
		.exec((err, students) => {
			if (err) {
				return res.apiError('数据查询出错，请重试！', err);
			}
			res.apiResponse({students});
		})
}
exports.getUsers = function (req, res) {
	User.model
		.find({isAdmin: false}) //不是管理员的
		.select('name')
		.exec((err, users) => {
			if (err) {
				return res.apiError('数据查询出错，请重试！', err);
			}
			res.apiResponse({users});
		})
}
exports.scoreHistory = function(req,res){
	const user = req.params.userId
	History.model.find({user},(err,data)=>{
		if(err) {
			return res.apiError('查询上课记录出错，请重试！', err);
		}
		res.apiResponse({success: true,data});
	})
}
exports.setScore = function (req, res) {
	const {_id, score, msg} = req.body;
	//更新User的score字段
	User.model
		.update({_id}, {$set: {score}},
			(err, result) => {
				if (err) {
					return res.apiError('更新数据出错，请重试！', err);
				}
				//创建一条更新记录
				const his = new History.model({user:_id,content: msg})
				his.save((err, result) => {
					if (err) {
						return res.apiError('新增记录出错，请重试！', err);
					}
					res.apiResponse({success: true});
				})
			})

}

exports.userAdd = function (req, res) {
	const user = new User.model(req.body);
	user.save((err, result) => {
		if (err) {
			return res.apiError('新增学员出错，请重试！', err);
		}
		res.apiResponse({success: true});
	});
}

exports.userUpdate = function (req, res) {
	const {_id} = req.body;
	User.model
		.update({_id}, req.body,
			(err, result) => {
				if (err) {
					return res.apiError('更新数据出错，请重试！', err);
				}
				res.apiResponse({success: true});
			})
}

exports.userDelete = function (req, res) {
	const {_id} = req.params;
	User.model
		.findOneAndRemove({_id},
			(err, result) => {
				if (err) {
					return res.apiError('删除数据出错，请重试！', err);
				}
				res.apiResponse({success: true});
			})
}

exports.getClasses = function (req, res) {
	Class.model.find().exec((err, classes) => {
		if (err) {
			return res.apiError('查询数据出错，请重试！', err);
		}
		res.apiResponse({success: true, classes});
	})
}

exports.classAdd = function (req, res) {
	const cls = new Class.model(req.body);
	cls.save((err, result) => {
		if (err) {
			return res.apiError('新增班级出错，请重试！', err);
		}
		res.apiResponse({success: true});
	});
}

exports.classUpdate = function (req, res) {
	const {_id} = req.body;
	Class.model
		.update({_id}, req.body,
			(err, result) => {
				if (err) {
					return res.apiError('更新数据出错，请重试！', err);
				}
				res.apiResponse({success: true});
			})
}

exports.classDelete = function (req, res) {
	const {_id} = req.params;
	Class.model
		.findOneAndRemove({_id},
			(err, result) => {
				if (err) {
					return res.apiError('删除数据出错，请重试！', err);
				}
				res.apiResponse({success: true});
			})
}
