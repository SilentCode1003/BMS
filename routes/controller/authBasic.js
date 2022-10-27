const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        res.redirect('/filling');
    } else {
        res.redirect('/login');
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