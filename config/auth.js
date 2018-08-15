
exports.isUser= function(req,res,next){
    if(req.isAuthenticated()){
        next()
    }else{
        req.flash('danger', 'Please Log In.')
    }
}

exports.isAdmin= function(req,res,next){
    if(req.isAuthenticated() && res.locals.user.admin ==1 ){
        next()
    }else{
        req.flash('danger', 'Please Log In as Admin First.')
        res.redirect('/users/login')
        
    }
}