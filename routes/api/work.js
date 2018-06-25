var keystone = require('keystone');
var Work = keystone.list('Work');

exports.getWorks = function (req, res) {
	const user = req.query.user;
	const time = req.query.time;
	//const q = Work.model.find();//Query对象
	const q = Work.paginate({
		page:req.query.page || 1,//当前页码
		perPage:5 //每页尺寸
	});//Query对象
	
	//构造查询条件
	if (user == 'me'){//要求用户登录
		if(req.user) {//登录过了
		    q.where('user').eq(req.user);
		}else{
			return res.apiNotAllowed('请先登录');
		}
	}
	const now = new Date();//当前服务器时间
	if(time == 'week') {
	    now.setDate(now.getDate()-7);//一周前
		q.where('createdAt').gte(now);
	}else{
		now.setMonth(now.getMonth()-1);//一月前
		q.where('createdAt').gte(now);
	}
	
	q.populate('user', 'name')
		.select('img.url createdAt user')
		.exec(function (err, works) {
			if (err) {
				return res.apiError('数据查询出错，请重试！', err);
			}
			res.apiResponse({works})
		})
}

exports.getAll = function (req, res) {
	const {user} = req.query;
	let q = null;

	//构造查询条件
	if (user) q = Work.model.find({user})
	else q = Work.model.find()

	q.populate('user','name')
	 .select('name img createdAt user')
	 .exec(function (err, works) {
		if (err) {
			return res.apiError('数据查询出错，请重试！', err);
		}
		res.apiResponse({works})
	 })
}

exports.workAdd = (req,res)=>{
	const work = new Work.model(req.body);
	work.save((err,result)=>{
		if(err) return res.apiError('新增作品失败',err)

		res.apiResponse({success:true})
	})
}

exports.workUpdate = (req,res)=>{
	Work.model.update(
		{_id:req.body._id},
		req.body,
		(err,result)=>{
			if(err) return res.apiError('新增作品失败',err)

			res.apiResponse({success:true})	
		}
	);
}

exports.workDelete = (req,res)=>{
	Work.model.findOneAndRemove(
		{_id:req.params._id},
		(err,result)=>{
			if(err) return res.apiError('新增作品失败',err)

			res.apiResponse({success:true})	
		}
	);
}
