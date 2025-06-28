import jwt from "jsonwebtoken";


export const userAuth = async(req, res, next)=>{
    const {token} = req.cookies;
    console.log(token);
    if(!token)
        {
            res.status(400).json({
                success:false,
                msg: "Not AUthorized"
            })
        }
        try{

            const decodedtoken = await jwt.verify(token , process.env.JWT_SECRET)
            console.log("decodec:CN",decodedtoken);

             if(decodedtoken?.id) 
            // This means:
            // "If decodedToken exists and has a property id, then proceed."
                {
                    req.userId = decodedtoken.id;
                    next();
                }else{
                    {
                        return res.status(401).json({
                          success: false,
                          message: "Invalid token payload.",
                        });
                      }
                }

        }catch(err)
        {
            res.status(404).json({
                success:false,
                message: err.message
            })
        }
}