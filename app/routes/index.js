const { body } = require('express-validator')

module.exports = function(application){
    application.get('/', function(req, res){
       application.app.controllers.index.home(application, req, res);
    });

    application.post('/login', 
    body('username').notEmpty().withMessage('Username required'),
    //body('password').notEmpty().withMessage('Password required'),
    function(req, res){
        application.app.controllers.index.login(application, req, res);
    });
}