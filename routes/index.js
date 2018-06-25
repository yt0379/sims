var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);
var path = require("path");  
var moment = require("moment");   
var multer  = require('multer');  

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api'),
};


var storage = multer.diskStorage({  
  destination: function (req, file, cb) {  
    cb(null, path.join(__dirname,"/../uploads"));  
  },  
  filename: function (req, file, cb) {  
    var date = new Date();  
    cb(null, "("+moment().format("YYYY-MM-DD")+")"+file.originalname);  
  }  
});  
  
var upload = multer({ storage: storage })  

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/admin', routes.views.index);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	// api
	app.all('/api*',keystone.middleware.api);
	app.get('/api/works', routes.api.work.getWorks);
	app.post('/api/works', routes.api.work.workAdd);
	app.put('/api/works', routes.api.work.workUpdate);
	app.delete('/api/works/:_id', routes.api.work.workDelete);
	app.get('/api/getWorks', routes.api.work.getAll);
	app.post('/api/login', routes.api.user.login);
	app.get('/api/userInfo', routes.api.user.getUserInfo);
	app.get('/api/userList', routes.api.user.getUserList);
	app.get('/api/users', routes.api.user.getUsers);
	app.post('/api/setScore', routes.api.user.setScore);
	app.get('/api/scoreHistory/:userId', routes.api.user.scoreHistory);
	app.post('/api/user', routes.api.user.userAdd);
	app.put('/api/user', routes.api.user.userUpdate);
	app.delete('/api/user/:_id', routes.api.user.userDelete);
	app.get('/api/classes', routes.api.user.getClasses);
	app.post('/api/classes', routes.api.user.classAdd);
	app.put('/api/classes', routes.api.user.classUpdate);
	app.delete('/api/classes/:_id', routes.api.user.classDelete);

	app.post(
		'/api/upload',  
		routes.api.upload.upload);
	
	app.delete('/api/removeFile/:id', 
		routes.api.upload.removeFile);

};
