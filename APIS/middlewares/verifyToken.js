const jwt=require("jsonwebtoken")
require("dotenv").config()


const checkToken = (req, res, next) => {

    //get token from req obj header
    let tokenWithBearer=req.headers.authorization;
    
    let token;

    //if token not existed
    if(tokenWithBearer===undefined){
       
        return res.send({message:"Unauthorized access"})
    }
    //if token is existed,verify
    else{
        token=tokenWithBearer.split(" ")[1]
        jwt.verify(token,process.env.SECRET,(err,decoded)=>{
            if(err){
                return res.send({message:"Session expired..login to continue..."})
            }
            else{
                next()
            }

        })
    }


}



module.exports = checkToken;