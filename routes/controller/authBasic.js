function authUser(req, res, next) {
    if (req.user == null) {
        res.status(403);
        return res.render('login', { title: 'Budget Monitoring System' });
        
    }
    next();
}

function notLogin(req, res, next) {
    if (req.user == null) {
        res.status(403);
        return res.render('filling', { title: 'Budget Monitoring System' });
        
    }
    next();
}

const authPage = (permissions) =>{
    console.log(permissions);
    return (req, res, next) => {
        const userRole = req.data;
        console.log(`Position: ${userRole}`)
        if(permissions.includes(userRole)){
            next();
        }
        else{
            return  res.render('login', { title: 'Budget Monitoring System' });
        }
    }
};

const isAuth = (req, res, next) => {
    if(req.session.isAuth){
        next();
    }else{
        res.redirect('/login');
    }
};

const isAuthAdmin = (req, res, next) => {
    if(req.session.isAuth && req.session.position == "HR"){
        next();
    }else if(req.session.isAuth && req.session.position == "CREATOR"){
        next();
    }
    else{
        res.redirect('/login');
    }
};


module.exports = { authUser, notLogin, authPage, isAuth, isAuthAdmin}