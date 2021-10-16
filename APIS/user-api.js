const exp = require('express')
const userApi = exp.Router();

const expressErrorHandler = require("express-async-handler")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const checkToken=require("./middlewares/verifyToken")

//add body parsing middleware
userApi.use(exp.json())
const multerObj=require("./middlewares/multerCloudinary")


//import MongoCL

//http://localhost:3000/user/getusers
//get users
userApi.get("/getusers", expressErrorHandler(async (req, res) => {
    let userCollectionObj=req.app.get("userCollectionObj")

    let userList = await userCollectionObj.find().toArray()
    res.send({ message: userList })

}))





//get user by username
userApi.get("/getuser/:username", expressErrorHandler(async (req, res, next) => {
    let userCollectionObj=req.app.get("userCollectionObj")


    //get username from url
    let un = req.params.username;
    //search
    let userObj = await userCollectionObj.findOne({ username: un })

    if (userObj === null) {
        res.send({ message: "User not existed" })
    }
    else {
        res.send({ message: userObj })
    }
}))



















//http://localhost:3000/user/createuser
//create user
userApi.post("/createuser", multerObj.single('photo'), expressErrorHandler(async (req, res, next) => {

    let userCollectionObj = req.app.get("userCollectionObj")

    //get user obj
    let newUser = JSON.parse(req.body.userObj)

    //search for existing user
    let user = await userCollectionObj.findOne({ username: newUser.username })
    //if user existed
    if (user !== null) {
        res.send({ message: "User already existed" });
    }
    else {
        //hash password
        let hashedPassword = await bcryptjs.hash(newUser.password, 7)
        //replace password
        newUser.password = hashedPassword;
        //add image url
        newUser.profileImage=req.file.path;
        delete newUser.photo;
        //insert
        await userCollectionObj.insertOne(newUser)
        res.send({ message: "User created" })
    }
}))


//http://localhost:3000/user/updateuser/<username>

userApi.put("/updateuser/:username", expressErrorHandler(async (req, res, next) => {
    let userCollectionObj=req.app.get("userCollectionObj")


    //get modified user
    let modifiedUser = req.body;
    //update
    await userCollectionObj.updateOne({ username: modifiedUser.username }, { $set: { ...modifiedUser } })
    //send res
    res.send({ message: "User modified" })

}))




//delete user
userApi.delete("/deleteuser/:username", expressErrorHandler(async (req, res) => {
    let userCollectionObj=req.app.get("userCollectionObj")


    //get username from url
    let un = req.params.username;
    //find the user
    let user = await userCollectionObj.findOne({ username: un })

    if (user === null) {
        res.send({ message: "User not existed" })
    }
    else {
        await userCollectionObj.deleteOne({ username: un })
        res.send({ message: "user removed" })
    }
}))




//user login
userApi.post('/login', expressErrorHandler(async (req, res) => {
    let userCollectionObj=req.app.get("userCollectionObj")


    //get user credetials
    let credentials = req.body;
    //search user by username
    let user = await userCollectionObj.findOne({ username: credentials.username })
    //if user not found
    if (user === null) {
        res.send({ message: "invalid username" })
    }
    else {
        //compare the password
        let result = await bcryptjs.compare(credentials.password, user.password)
        //if not matched
        if (result === false) {
            res.send({ message: "Invalid password" })
        }
        else {
            //create a token
            let signedToken =  jwt.sign({ username: credentials.username }, process.env.SECRET, { expiresIn: 5 })
            //send token to client
            res.send({ message: "login success", token: signedToken,username: credentials.username ,userObj:user})
        }

    }

}))


userApi.get("/getproducts/:username",expressErrorHandler(async (req,res,next)=>{
    let userCartCollectionObject=req.app.get("userCartCollectionObject")
    let un=req.params.username;
    let userProbObj=await userCartCollectionObject.findOne({username:un})
    if(userProbObj === null){
        res.send({message:"cart-empty"})

    }
    else{
        res.send({message:userProbObj})
    }
}))
userApi.post("/add-to-cart",expressErrorHandler(async(req,res,next)=>{
    let userCartCollectionObject=req.app.get("userCartCollectionObject")
    let newProdObject=req.body;
    
    let userCartObj=await userCartCollectionObject.findOne({username:newProdObject.username})
    
    if(userCartObj===null){
        let products=[]
        products.push(newProdObject.productObject)
        let newUserCartObject={username:newProdObject.username,products}
        await userCartCollectionObject.insertOne(newUserCartObject)
        let latestCartObj=await userCartCollectionObject.findOne({username:newProdObject.username})
        res.send({message:"your selected product added to cart",latestCartObj: latestCartObj})
        
        
    }
    else{
        userCartObj.products.push(newProdObject.productObject)
        await userCartCollectionObject.updateOne({username:newProdObject.username},{$set:{...userCartObj}})
        let latestCartObj=await userCartCollectionObject.findOne({username:newProdObject.username})
        res.send({message:"your selected product added to cart",latestCartObj:latestCartObj})

    }
}

))


//dummy route to create protected resource
//dummy route to create protected resource
userApi.get("/testing",checkToken, (req, res) => {
    let userCollectionObj=req.app.get("userCollectionObj")

    res.send({ message: "This is protected data" })
})





//export
module.exports = userApi;