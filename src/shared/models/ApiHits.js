//jab client hame data send karta hain toh wo queue ke through ata hain, toh usse ham directly database  main nahi dalenge 
//server->queueingSystem->processor(its a server which will enable us to process the data and then store it in database) ->database

import mongoose from 'mongoose';

const apiHitSchema = new mongoose.Schema({
    eventId:{
        type:String,
        required: true,
        unique:true,
        index: true,
    },
    timestamp:{
        type:Date,
        required: true,
    },
    serviceName:{
        type:String,
        required:true,
        index: true,
    },
    endpoint:{
        type:String,
        required:true,
        index:true,
    },
    statusCode:{
        type:Number,
        required: true,
        index: true,
    },
    latencyMs:{
        type:Number,
        required:true,
    },
    clientId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Client',
        required: true,
        index: true,
    },
    apiKeyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'ApiKey',
        required: true,
        index: true,
    },
    ip:{
        type:String,
        required: true,
    },
    userAgent:{
        type:String,
        default:'',
    }


},{
    timestamps: true,
    collection:'api_hits'
});

//create compound indexes for common series
apiHitSchema.index({clientId:1,serviceName:1,endpoint:1});
apiHitSchema.index({clientId:1,timestamp:-1,statusCode:1});
apiHitSchema.index({apiKeyId:1, timestamp:-1});
apiHitSchema.index({timestamp:1},{expireAfterSeconds:2592000});

const ApiHit = mongoose.model('ApiHit',apiHitSchema)
export default ApiHit
