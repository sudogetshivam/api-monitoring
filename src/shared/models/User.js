import mongoose from "mongoose";
import { validate } from "uuid";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength:3,
        validate: { // username value → passed into validator → stored in userName variable
            validator:function(userName){
                return  /^[a-zA-Z0-9._-]+$/.test(userName); 
            },
            message: "Please enter a valid username"
        }
    },

    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate:{
            validator: function(email){
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message:"Please enter a valid email"
        }
    },

    password:{
         type: String,
        required: true,
        minlength: 6,
        validate:{
            validator: function(password){ 
                if(this.isModified('password') && password && !password.startsWith('$2a$')) //this(means current document), isModified(feildName), If the password field was modified and the value is not already a bcrypt hash ($2a$), run password validation
                {
                    const validation = SecurityUtils.validatePassword(password)
                    return validation.success
                };
                return true //password was not being modified
            },
            //if it is reaching till message then surely an error has come

            // Mongoose calls this function when validation fails and passes an error object.
            // The parameter (here named `props`) is NOT reserved; it is just a variable name
            // and can be anything. It contains information about the validation error.
            // The most important property is `props.value`, which holds the actual value
            // of the field that failed validation (here, the password). We use this value
            // to generate a custom error message based on our password validation logic.

            //so basically props(or any name you keep), is a object having these properties
            // message({ value: passwordValue, path: 'password', ... })
            
            message: function (props){
                
                 if( props.value && !props.value.startsWith('$2a$'))
                {
                    const validation = SecurityUtils.validatePassword(props.value)
                    return validation.errors.join(". ")
                };
                return "Password validation failed"
            },
           
        }
    },
     role:{
                type: String,
                enum: ['super_admin','client-admin','client-viewer'],
                default:'client_viewer'
            },
     clientId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'Client',
                required: function(){
                    return this.role != 'super_admin' //client_id cannot be superadmin
                }
            },
    isActive : {
                type: Boolean,
                default: true
        },
        permissions:{
            canCreateApiKeys:{
                Type: Boolean,
                default: false,
            },
            canManageUsers:{
                Type: Boolean,
                default: false,
            },
            canViewAnalytics:{
                Type: Boolean,
                default: false,
            },
            canExportData:{
                Type: Boolean,
                default: false,
            },
        }
},{
    timestamps:true,
    collection:"users"
})


//this is a middleware if any save operation is there, before saving it checks has the user changed the password or not
userSchema.pre('save',async function (next) {
    if(!this.isModified('password'))
        return next(); // we have to return from here to the next path if condition statisfies cant go down
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
        next();
    } catch (error) {
        next(error);
    }
    
})

userSchema.index({clientId:1,isActive:1});//basically it creates B-trees if 1, sorted in ascending order
userSchema.index({role:1})

const User = mongoose.model("User",userSchema)
export default User