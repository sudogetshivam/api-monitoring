import ResponseFormatter from "../utils/responseFormatter.js";

const authenticate = async(req, res, next) => {
    try {
        let token = null;

        if(req.cookies && req.cookies.authToken){
            token = req.cookies.authToken;
        }
        else{
            return res.status(401).json(ResponseFormatter.error("Authentication token is required",401));
        }

        const decoded = jwt.verify(token,config.jwt.secret) //symmetric encryption is being used here

        const {userId, email, username, role, clientId} = decoded

        //adding new property inside req object
        req.user = {
            userId, email, username, role, clientId
        }

        next();
    } catch (error) {
        logger.error("Authentication Failed",{
            error:error.message,
            path: req.path
        });

        if(error.name === "TokenExpiredError"){
            return res.status(401).json(ResponseFormatter.error("Token expired",401))
        }

        return res.status(401).json(ResponseFormatter.error('Invalid Token',401));

        
    }
}

export default authenticate