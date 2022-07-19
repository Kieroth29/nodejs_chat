module.exports = function(application){
    application.get('/logout', function(req, res){
        req.session.destroy();
        application.app.controllers.index.home(application, req, res);
    });
}