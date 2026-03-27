import winston from 'winston'
import config from  "./index.js"
/**
 * Logger configuration
 * provides logging
*/

const logger = winston.createLogger({
    level: config.node_env === 'production'?'info':'debug',
    //combines multiple formatting rule
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.errors({stack: true}),
        winston.format.splat(),
        winston.format.json()

    ),
    //add this to every log
    defaultMeta: {service: "api-monitoring"},

    //“Transport” = where logs are saved
    transports: [
        //only for error
        new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
        new winston.transports.File({filename: 'logs/combined.log'})

    ]
})

if(config.node_env != 'production'){
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }))
     
}

export default logger
