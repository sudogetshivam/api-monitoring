import logger from "../config/logger.js"
import ResponseFormatter from "../utils/responseFormatter.js"

//look this errorHandler that for-real handles the error so that our system doesnt get crashed
//THIS IS OUR AGENT, koi bhi eror express ke pass ata hain toh express esse dega aur handle karegaa

const errorHandler = (err, req, res, next)=>{
    let statusCode = err.statusCode || 500
    let message = err.message || "Internal server error"
    let errors = err.errors || null;

    logger.error('Error Occured:',{
        message: err.message,
        statusCode,
        stack: err.stack,
        path: req.path,
        method: req.method
    })

    if(err.name === "ValidationError"){
        statusCode = 400;
        message = "ValidationError"
        errors = Object.values(err.errors).map((e)=> e.message);
    }
    else if(err.name === 'MongoServerError' && err.code === 11000){
        statusCode=409;
        message = 'Duplication Key Errors'
    }
    else if(err.name === 'JsonWebTokenError'){
        statusCode = 401;
        message = 'Invalid Token';
    }
    else if(err.name === 'TokenExpiredError'){
        statusCode = 401,
        message = 'Token expired'
    };
    
    res.status(statusCode).json(ResponseFormatter.error(message, statusCode, errors))
}
export default errorHandler