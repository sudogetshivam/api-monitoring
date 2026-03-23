class ResponseFormatter {
    /**
     * We are using static because we dont need to create object and it saves memory
     * const formatter = new ResponseFormatter()
     * formatter.sucess();
     * 
     * with static:
     *  ResponseFormatter.sucess();
     */
    static success(data =  null, message = "Success", statusCode = 200){
        return{
            success: true,
            data,
            message,
            statusCode,
            timeStamp: new Date().toISOString() //gives current date and time in ISO format 
        }
    }

    static error(message = "error", statusCode = 500, error = null){
        return{
            success: false,
            error,
            message,
            statusCode,
            timeStamp: new Date().toISOString() //gives current date and time in ISO format 
        }
    }
    static validationError(error = null){
        return{
            success: false,
            message: 'Validation Failed',
            error,
            statusCode: 400,
            timeStamp: new Date().toISOString() //gives current date and time in ISO format 
        }
    }

    /*
    *this paginated will not send data in once but in parts
     */

    static paginated(data = null, page, limit, total){
        //pro tip: eske paramters main value pass kardo phele to be on safeside
        //!because null value might get returned
        return{
            data,
            pagination:{
                page,
                limit,
                total,
                totalPage: Math.ceil(total/limit)
            },
            timeStamp: new Date().toISOString() //gives current date and time in ISO format 
        }
    }

    
}

export default ResponseFormatter