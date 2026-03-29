//to handle internal servers error

class appError extends Error{
    constructor(message, statusCode = 500, error = null){
        //!never use this. before super in child class because as a child class untill and unless the parent class is not called the object insatnce doesnt exist
        super(message) //this will say to its parent class which is Error, that use this message inside your constructor
        this.statusCode
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor)

    }
}

export default appError