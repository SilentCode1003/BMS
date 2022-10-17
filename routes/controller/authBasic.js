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


module.exports = { authUser, notLogin }