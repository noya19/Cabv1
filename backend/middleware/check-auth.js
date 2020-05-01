const jwt = require("jsonwebtoken");  //import the package

module.exports = (req, res, next) => {
  try{
    const token = req.headers.authorization.split(" ")[1];  //we receive the token
    const decodedToken = jwt.verify(token, "this_is_a_password");      //verify the token with the help pf that secret
    req.userData = {email: decodedToken.email, userId: decodedToken.userid };
    next();
  }catch(error){
    res.status(401).json({message: "You are not authenticated!"});
  }
}
