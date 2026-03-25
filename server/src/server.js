import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './shared/config/index.js';
import logger from './shared/config/logger.js';
import mongodb from './shared/config/mongodb.js';
import postgres from './shared/config/postgres.js';
import rabbitmq from './shared/config/rabbitmq.js';
import errorHandler from './shared/middlewares/errorHandler.js';
import ResponseFormatter from './shared/utils/responseFormatter.js';

//intialize express app
const app = express();

//helmet is used to set various HTTP headers for security purposes. It helps protect the app from some well-known web vulnerabilities by setting appropriate HTTP headers. For example, it can prevent clickjacking, cross-site scripting (XSS), and other common attacks by configuring headers like Content-Security-Policy, X-Frame-Options, and X-XSS-Protection.
app.use(helmet())
app.use(cors())

//express.json() is a built-in middleware function in Express that parses incoming requests with JSON payloads and is based on body-parser. 
// It makes it easier to handle JSON data sent in the request body, allowing you to access it via req.body in your route handlers. This is particularly useful for APIs that receive data in JSON format, as it simplifies the process of extracting and working with that data in your application.

//if request body is JSON, convert it into JavaScript object and pass it to the next middleware or route handler. This allows you to easily access the data sent in the request body as a JavaScript object, making it easier to work with in your application.
app.use(express.json())


//express.urlencoded() is a built-in middleware function in Express that parses incoming requests with URL-encoded payloads. 
// It is based on body-parser and is used to handle form submissions and other URL-encoded data sent in the request body. 
// When you use express.urlencoded(), it allows you to access the parsed data via req.body in your route handlers, making it easier to work with form data and other URL-encoded information in your application.

/**
 * Example:
 * Form sends:name=Shivam&age=20
 * With middleware: req.body  { name: "Shivam", age: "20" }
 */


//extended: true allows complex/nested objects
app.use(express.urlencoded({extended: true}))

//har ek re  quest main ek log print karna chatha hu
app.use((req,res,next)=>{
    logger.info(`${req.method} ${req.path}`,{
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });
    next();
})

app.use(errorHandler)
/**
 * It will return like this object
 * {
  success: true,
  data: {
    status: 'healthy',
    timestamp: ...,
    uptime: ...
  },
  message: "Success",
  statusCode: 200,
  timeStamp: "2026-03-25T..."
}
 */

app.get('/health',(req,res)=>{
    res.status(200).json(
        ResponseFormatter.success({
            status: 'healthy',
            timestamp: new Date().toISOString,
        }
        )
    )
})

app.get('/' ,(req,res)=>{
    res.status(200).json(ResponseFormatter.success(
        {
            service: 'API HIT Monitoring System',
            version: '1.0.0',
            endpoints: {
                health: '/health',
                auth: '/api/auth',
                ingest: '/api/hit',
                analystics: '/api/analytics',
            }
        },
        'API HIT Monitoring System'
    ))
})

app.use((req,res)=>{
    res.status(404).json(ResponseFormatter.error("Endpoint not found",404))
})

async function initializeConnection() {
    try {
        logger.info("Initializing database connection")

        await mongodb.connect()

        await postgres.testConnection()

        await rabbitmq.connect()

        logger.info("All connections established successfully")
    } catch (error) {
        logger.error("Failed to intialize connections",error)
        throw error
    }
}

async function startServer() {
    try {
        await initializeConnection();
        const server = app.listen(config.port, () =>{
            logger.info(`Server started at ${config.port}`)
            logger.info(`Environment: ${config.node_env}`)
            logger.info(`API avaliable at https://localhost:${config.port}`)
        }
        )

        //before getting disconnect we cant lets these run all the time, we need to shutdown it
        const gracefulShutdown  = async (single) => {

        }
    } catch (error) {
        
    }
}
