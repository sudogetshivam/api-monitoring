import config from "./index.js"
import logger from "./logger.js"
import amqp from 'amqplib'

class RabbitMQConnection{
    constructor(){
        this.connection = null;
        this.channel = null;
        this.isConnecting = false;
    }

    async connect(){
        if(this.channel){
            return this.channel;
        }
        if(this.isConnecting){
            await new Promise((resolve) => {
                const checkInterval = setInterval(()=>{
                    if(!this.isConnecting){
                        clearInterval(checkInterval)
                        resolve()
                    }
                },100)
            })

            return this.channel
        }

        try{
            this.isConnecting = true;

            logger.info("Connecting to RabbitMQ",config.rabbit_mq.url)
            this.connection = await amqp.connect(config.rabbit_mq.url)
            this.channel = await this.connection.createChannel()

            //dead letter queue
            const dlqName = `${config.rabbit_mq.queue}.dlq` //also acting as routing key


            await this.channel.assertQueue(dlqName,{
                durable: true
            })

            //normal queue, but i can talk with dlq if message is failed to process after retry attempts, and also set message ttl for retry delay
            await this.channel.assertQueue(config.rabbit_mq.queue,{
                durable: true,
                arguments:{
                    "x-dead-letter-exchange": "",
                    "x-dead-letter-routing-key": dlqName,
                    "x-message-ttl": config.rabbit_mq.retryDelay
                }
            })

            logger.info("RabbitMQ connected queue",config.rabbit_mq.queue)
            this.connection.on("close",()=>{
                logger.warn("RabbitMQ connection Closed")
                this.connection = null
                this.channel =  null
            })

            this.connection.on("error",(err)=>{
                logger.error("RabbitMQ connection error",err)
                this.connection = null
                this.channel =  null
            })




            this.isConnecting = false
            return this.channel;
        }
        catch(error){
            this.isConnecting = false;
            logger.error("Failed to connect to RabbitMQ",error)
            throw error

        }

    }

    getChannel(){
        return this.channel;
    }

    getStatus(){
        if(!this.connection || !this.channel) return "disconnected";
        if(this.connect.close) return "closing"
        return "connected"
    }

    async close(){
        try {
            if(this.channel){
                await this.channel.close()
                this.channel = null;
            }

            if(this.connection){
                await this.connection.close()
                this.connection = null;
            }

            logger.info("RabbitMQ disconnected Succesfully")
        } catch (error) {
            logger.error("Error in closing RabbitMQ connection",error)

            
        }
    }
}