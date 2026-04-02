//kisi ne username ke andar kisi ne email daldiya toh, ya email main password daldiya toh.. 
// toh hame validation karni padegi ki user ne sahi data dala hai ya nahi.. toh uske liye hum validation middleware banayenge..
//during run-time only

import ResponseFormatter from "../utils/responseFormatter.js";

const validate = (schema) => (req,res,next)=>{
    if(!schema){
        return next()
    }

    const error = [];
    const body = req.body || {}

    //object main loop lagane ka tarika

    /**
     * const schema = {
    username: { required: true },
    email: { required: true }
            |
            |
            | after Object.entries
            |
            |
            V
    [
  ["username", { required: true }],
  ["email", { required: true }]

  feild = "username"
  rules = { required: true }
]
};
     */
    Object.entries(schema).forEach(([feild,rules]) =>{
        const value = body[feild] //if feild=="username" then body[feild] = "someUsernmae"

        if(rules.required && ((value==null) || value==undefined || value === "")){
            error.push(`${feild} is required`)
            return 
        }

        if(rules.minlength && typeof value === 'string' && value.length < rules.minlength){
            error.push(`${feild} must be at least ${rules.minlength} characters`)
        }

        if(rules.custom && typeof rules.custom === 'function'){
            const customErr = rules.custom(value, body);
            if(customErr) error.push(customErr)
        }
    })

    if(error.length){
        return res.status(400).json(ResponseFormatter.error("Validation Failed", 400 ,error))
    }

    next();

}

export default validate