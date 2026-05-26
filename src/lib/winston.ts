/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */

//node module
import { createLogger,format, transports,transport } from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

//custom module
import config from '@/config';

//initiallise an array ti hold all configuraed winston transports 

const transportation: transport[] =[];

//throw error when source taken or ingesting host is missing
if(!config.LOGTAIL_SOURCE_TOKEN || !config.LOGTAIL_INGESTING_HOST){
    throw new Error ('Logtail source taken or ingesting host is missing....!')
}

///creat a logtail instance for sending structured logs to a remote loging service

const logtail = new Logtail(config.LOGTAIL_SOURCE_TOKEN,{
    endpoint: config.LOGTAIL_INGESTING_HOST
});

//in production env , push logtailtransport to winston transport
if(config.NODE_ENV === 'production'){
    transportation.push(new LogtailTransport(logtail));
}

//destructure logging format utilities from winston
const {colorize,combine,timestamp,label,printf} =format;

//in development env,use console loging for real time feedback
if(config.NODE_ENV ==='development'){
    transportation.push(
        new transports.Console({
            format: combine(
                colorize({ all: true}),
                label(),
                timestamp({format : 'DD MMMM hh:mm:ss A'}),
                printf(({level,message,timestamp})=>{
                    return `${timestamp} [${level}]: ${message}`
                })
            )
        })
        
    )
}

//create a winston logger with the selected transports
const logger = createLogger({
    transports: transportation,
})
export{logtail,logger};