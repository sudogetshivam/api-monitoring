import mongoose from "mongoose"
import config from "./index.js"
import logger from "./logger.js"

//single-skeleton design pattern

/**
 * MongoDB databse manager
 */
class MongoConnection {
    constructor(){
        this.connection =  null;
    }
    /**
     * Creates connection with MongoDb database
     * @returns {Promise<mongoose.Connection>}
     */

    async connect(){
        try {
            if(this.connection){
                logger.info("Mongodb already connected");
                return this.connection
            }

            await this.connection.connect(config.mongo.uri,{
                dbname: config.mongo.dbname
            })

            logger.info(`MongoDB connected: ${config.mongo.uri}`)

            this.connection.on("error",err => {
                logger.error("MongoDB connection error",err)
            })

            this.connection.on("disconnected",()=>{
                logger.info("MongoDB disconnected")
            })

            return this.connection()
        } catch (error) {
            logger.error("Failed to Connect MongoDB", error)
            throw error
            
        }
    }
    /**
     * This helps to disconnect backend
     */
    async disconnect(){
        try {
            if(this.connection){
                await mongoose.disconnect()
                this.connection = null
                logger.info("MongoDB disconnected")
            }  
        } catch (error) {
            logger.error("Failed to disconnect MongoDB", error)
            throw error
        }
    }
    /**
     * Getting current connection
     * @returns {mongoose.Connection}
     */
    getConnection(){
        return this.connection
    }
}

export default MongoConnection