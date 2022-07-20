const { body } = require('express-validator');

module.exports = function(application){
    application.get('/change_password', function(req, res){
        application.app.controllers.changePassword.passwordForm(application, req, res);
    });

    application.post('/change_password', 
    body('current').notEmpty().withMessage("Current password required"),
    body('new').notEmpty().withMessage("New password required"),
    body('confirm').notEmpty().withMessage("Password confirmation required"),
    function(req, res){
        application.app.controllers.changePassword.changePassword(application, req, res);
    })
}