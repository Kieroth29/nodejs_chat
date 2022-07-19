const { body } = require('express-validator');

module.exports = function(application){
    application.post('/chat', 
    body('username').notEmpty().withMessage('Name required for logging in the chat'),
    function(req, res){
       application.app.controllers.chat.startChat(application, req, res);
    });

    application.get('/chat', function(req, res){
        application.app.controllers.chat.startChat(application, req, res);
    });
}