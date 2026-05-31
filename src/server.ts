/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */

// node modules

import express from "express";
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

//custom modules
import config from '@/config';
import corsOptions from "@/lib/cors";
import {logger,logtail} from '@/lib/winston';
import {connectToDatabase,disconnectDatabase} from '@/lib/mongoose';

//routes
import router from '@/routes';

//initial  express
const server = express();
//use cors 
server.use(cors(corsOptions));
//secure headers
server.use(helmet());
//parser json request bodies
server.use(express.json());
//perser url encoded bodies 
server.use(express.urlencoded({
    extended:true
}));

//set the public folder
server.use(express.static(`${__dirname}/public`));
//compress response
server.use(compression());

//cookies parser
server.use(cookieParser());

//async func to initalize the application
(async function (): Promise<void>{
    try{
        // establish a connection to the mongodb
        await connectToDatabase();
        //register application routes under the root path
        server.use('/',router);

        //start the server 
        server.listen(config.PORT, ()=>{
          logger.info(`server listening @ http://localhost : ${config.PORT}`);
        });
    }catch(error){
        logger.info('Faild to start server', error)
    //exit the prosses to avoid the running in an unstable state
    if(config.NODE_ENV === 'production'){
        process.exit(1);
    }
    }
} )();
//handle graceful  server shutdown on termination signals
const serverTermination = async (signal: NodeJS.Signals): Promise<void> =>{
    try{
        //disconnect from the mongoDB database
        await disconnectDatabase();
        //log a warning indicating the server is shutting down
        logger.info('server shutdown',signal);

        //flush any remaing logs to logstal before exiting
        logtail.flush();

        //exit the process cleanly
        process.exit(0);
    }catch(error){
        //log any error during the shutting down
        logger.info('error during the shutdown',error);
    }   
}

//listen for termination signal and trigger gracefuk shutdown
process.on('SIGTERM',serverTermination);
process.on('SIGINT',serverTermination);