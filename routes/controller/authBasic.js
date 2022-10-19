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


module.exports = { authUser, notLogin, authPage }