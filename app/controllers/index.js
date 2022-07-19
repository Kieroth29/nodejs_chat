const { validationResult } = require('express-validator');

module.exports.home = function(application, req, res){
    res.render("index", {validation: null});
}

module.exports.login = async function(application, req, res){
    var data = req.body;

    const errors = validationResult(req).array();
    if(errors.length > 0){
        res.render("index", {validation: errors});
        return;
    }

    const User = application.app.models.User;

    const userObject = await User.find({username: data.username, password: String(data.password)})
    
    if(userObject.length == 0){
        const paswordVerification = await User.find({username: data.username});
        
        if(paswordVerification.length > 0){
            res.render("index", {validation: [{value: '', msg: 'Incorrect password', param: 'password', location: 'body'}]});
            return;
        }else{
            res.send('not found');
            return;
        }
    }else if(userObject.length == 1){
        req.session.authenticated = true;
        req.session.username = userObject[0].username;
        req.session.userFirstName = userObject[0].name;
        req.session.userAge = userObject[0].age;
    }

    if(req.session.authenticated){
        res.render('chat', {username: userObject[0].username, name: userObject[0].name, age: userObject[0].age});
        return;
    }
    
    res.send('ok');
}