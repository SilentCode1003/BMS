const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.redirect('/filling');
    }
};

const isAuthAdmin = (req, res, next) => {
    if (req.session.isAuth && req.session.position == "HR") {
        next();
    } else if (req.session.isAuth && req.session.position == "CREATOR") {
        next();
    }
    else {
        res.redirect('/login');
    }
};


module.exports = { isAuth, isAuthAdmin }