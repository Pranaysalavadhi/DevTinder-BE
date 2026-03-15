const adminAuth = (req,res,next) =>{
    const token = 'abc';
    const isAuthenticated = token === 'abcd';

    if(!isAuthenticated){
        res.status(401).send("Unautherized Request")
    }
    else{
        next();
    }
}

module.exports = {
    adminAuth
}