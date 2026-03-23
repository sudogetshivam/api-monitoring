import mongoose from "mongoose";
import SecurityUtils from "../utils/SecurityUtils.js";
import { parse } from "dotenv";

const apiKeySchema = new mongoose.Schema(
    {
        keyId:{
            type:String,
            required: true,
            index:true,
            unique:true
        },
        keyValue: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        clientId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength:100,
        },
        environment:{
            type:String,
            enum:['production','staging','development','testing'],
            default:'production',
        },
        isActive:{ //is the api-key still active
            type: Boolean,
            default: true,
        },
        permissions:{
            canIngest:{
                type:Boolean,
                default: true,
            },
            canReadAnalytics:{
                type: Boolean,
                default: false,
            },
            allowedServices:[{
                type:Boolean,
                default: true,
            }] //this is a list be-aware,
    },
    security: {
    allowedIPs: [{
    type: String,
    validate: {
    validator: function (v) {
    return /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(v) ||
'0.0.0.0/0';
},

message: 'Invalid IP address format',   }
    }],
allowedOrigins:[{
    type:String,
    validate:{
        validator:function(v){
            return /^https?:\/\/[^\s]+$/.test(v) || v === '*';
        },
        message:'Invalid origin format',
    }

}],
lastRoated:{ //to improve security
type: Date,
default: Date.now,
},
rotationWarningDays:{
type:Number,
default: 30,
}
},

expiresAt:{
    type: Date, 
    default:()=>{
        const days = parseInt(process.env.API_KEY_EXPIRATION_DAYS || '365');
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    },
    index: true,

},
metaData:{
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //2 poeple can create api-hey one is client-admin or the super-admin
    },
    purpose:{
        type:String,
        maxlength:200,
        trim:true,  
    },
    tags:[{
        type:String,
        trim: true,
        maxlength:50,
    }]

},
createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
},
    },{
        timestamps:true,
        collection:'api_keys'
    }
);

apiKeySchema.index({clientId:1,keyId:1});
apiKeySchema.index({keyValue:1,isActive:1});
apiKeySchema.index({environment:1,clientId:1});
apiKeySchema.index({expiresAt:1},{expireAfterSeconds:0}); //this will automatically remove expired keys

 const ApiKey = mongoose.model('ApiKey',apiKeySchema);

 export default ApiKey;

