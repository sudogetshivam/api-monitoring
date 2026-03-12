import mongoose, { Mongoose } from "mongoose";
/**
 * MongoDB schema for client/organizations
 * Each client represents a business/organization using the monitoring service
 */

const clientSchema = new mongoose.Schema(
    {
        name:{
        type: String,
        required: true,
        trim:true,
        minlength:2,
        maxlength:100,
        },
        slug:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: /^[a-z0-9-]+$/,
        },
        email:{
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        website:{
            type:String,
            default:'',
        },
        description:{
            type:String,
            maxlength:500,
            default:''
        },
        createdBy:{
            type: Mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isActive:{
            type:Boolean,
            default:true
        },
        settings:{
            dataRetentionDays:{
                type:Number,
                default: 30,
                min: 7,
                max: 365,
            },
            alertsEnabled:{
                type: Boolean,
                default: true
            },
            timezone:{
                type:String,
                default: 'UTC'
            }

        }
    },
    {
        timestamps: true,
        collection: 'clients' // This forces the name to be exactly 'clients'
    }
);

clientSchema.index({isActive:1})
const Client = mongoose.model('Client',clientSchema)

export default Client;