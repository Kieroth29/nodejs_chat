const { validationResult } = require('express-validator')
const crypto = require('crypto')

module.exports.passwordForm = function(application, req, res){
    if(req.session.authenticated == true){
        res.render("change_password", {validation: null});
        return;
    }else{
        res.render("index", {validation: null});
        return;
    }
}

module.exports.changePassword = async function(application, req, res){
    console.log(req.session);
    if(req.session.authenticated === undefined || req.session.authenticated === false){
        res.render("index", {validation: null});
        return;
    }
    
    const data = req.body;

    const errors = validationResult(req).array();
    
    if(errors.length > 0){
        res.render("change_password", {validation: errors});
        return;
    }
    
    if(data.new != data.confirm){
        res.render("change_password", {validation: [{value: '', msg: 'Passwords must match', param: 'confirm', location: 'body'}]})
        return;
    }

    const newPassword = crypto.createHash('sha256').update(data.new).digest('hex');
    const currentPassword = crypto.createHash('sha256').update(data.current).digest('hex');

    const userModel = application.app.models.User;
    
    const user = await userModel.find({username: req.session.username})

    if(user[0].password != currentPassword){
        res.render("change_password", {validation: [{value: '', msg: 'Current password is incorrect', param: 'current', location: 'body'}]})
        return;
    }

    await userModel.updateOne({username: req.session.username}, {$set: {password: newPassword}})

    res.render('chat', {username: req.session.username, name: req.session.name})
    
}