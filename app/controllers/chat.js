const { validationResult } = require('express-validator');

module.exports.startChat = async function(application, req, res){
    if(req.session.authenticated == false){
        res.render('index', {validation: null});
        return;
    }

    const errors = validationResult(req).array();
    
    if(errors.length > 0){
        res.render('index', {validation: errors});
        return;
    }
    
    var data = req.body;
    
    ws = application.ws;
    
    const userModel = application.app.models.User;

    const userData = await userModel.find({username: data.username});

    ws.emit('clientLogin', {username: userData.username, name: userData.name});

    res.render("chat", {username: userData.username, name: userData.name});
}
