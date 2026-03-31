import ResponseFormatter from "../utils/responseFormatter.js";

/*
function authorize(allowedRoles = []) {
    return function(req, res, next) {
    }
} 
similar thing...    
*/
const authorize = (allowedRoles = []) => (req,res,next) =>{
    try {
        if(!req.user && !req.user.role){
            return res.status(403).json(ResponseFormatter.error("Forbidden, no role to user",403));
        }

        if(allowedRoles.length === 0){ //ye ek aisa route hain koi bhi insaan aasakta hain par uppar waaale main roles waale bande chaiye
            next();
        }

        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json(ResponseFormatter.error("Insufficient permissions",403));   
        }

        next()
    } catch (error) {
        logger.error("Authorization Failed",{
            error:error.message,
            path: req.path
        });

        return res.status(403).json(ResponseFormatter.error("Forbidden",403));


    }
}

export default authorize