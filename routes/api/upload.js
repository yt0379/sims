var fs = require('fs');

exports.upload = (req,res)=>{
	try{
		var dir = './public/uploads';
		fs.existsSync(dir)||fs.mkdirSync(dir);

		var file = req.files.file;
		var oldPath = file.path;
		var newPath = dir + '/' + file.name;
		fs.renameSync(oldPath, newPath); 

		//返回上传结果
		res.apiResponse({
			success : true,
			id:file.name
		});
	}catch(err){
		res.apiError('上传文件出错',err)
	}
}

exports.removeFile = (req,res)=>{
	const path = `./public/uploads/${req.params.id}`;
	fs.unlink(path,(err)=>{
		if(err) return res.apiError('删除文件出错',err)
		res.apiResponse({success : true})
	});
}