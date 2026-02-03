import jwt from 'jsonwebtoken'


const userAuth = async (req, res, next) => {

    const {token} = req.headers;

    if(!token){
        res.status(400).json({success: false, message: "Not Authorized Login Again"});
    }

    try {
        
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if(!tokenDecode.id){
          return res.status(400).json({success: false, message: "Not Authorized Login Again"});
        }

        req.userId = tokenDecode.id;

        
        
        next();

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error.message})
    }

}

export default userAuth