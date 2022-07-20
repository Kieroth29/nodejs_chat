const { validationResult } = require('express-validator')
const crypto = require('crypto')

module.exports.registerForm = function(application, req, res){
    res.render("register", {validation: null});
}

module.exports.register = async function(application, req, res){
    const data = req.body;

    const errors = validationResult(req).array();

    if(errors.length > 0){
        res.render("register", {validation: errors});
        return;
    }

    const userModel = application.app.models.User;

    const usernameSearch = await userModel.find({username: data.username});
        
    if(usernameSearch.length > 0){
        res.render("index", {validation: [{value: '', msg: 'Username already exists', param: 'username', location: 'body'}]});
        return;
    }

    var encryptedPassword = crypto.createHash("sha256").update(data.password).digest("hex");

    const user = new userModel({
        username: data.username,
        password: encryptedPassword,
        name: data.name,
        age: data.age
    });

    await user.save();

    req.session.authenticated = true;
    req.session.username = data.username;
    req.session.userFirstName = data.name
    req.session.userAge = data.age;

    res.render("chat", {username: data.username, name: data.name});
}
