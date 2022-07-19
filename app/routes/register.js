const { body } = require('express-validator');

module.exports = function(application){

    application.get('/register', function(req, res){
        application.app.controllers.register.registerForm(application, req, res);
    });

    application.post('/register', 
    body("username").notEmpty().withMessage("Username required."),
    body("password").notEmpty().withMessage("Password required."),
    body("name").notEmpty().withMessage("Name required."),
    body("age").notEmpty().withMessage("Age required."),
    function(req, res){
        application.app.controllers.register.register(application, req, res);
    });
}