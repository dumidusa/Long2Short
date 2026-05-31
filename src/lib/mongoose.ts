 /**
  * @copyright 2026 dumidu sahan
  * @license Apache-2.0
  */

 //node module 
 import mongoose from 'mongoose';
 
 //custom module
import config from '@/config';
import { logger } from '@/lib/winston';

//types 
import type { ConnectOptions } from 'mongoose';

const ConnectOption: ConnectOptions ={
    serverApi:{
        version:'1',
        strict:true,
        deprecationErrors:true,
    },
    dbName:'long2short'
}

const connectToDatabase = async (): Promise<void> => {
    if(!config.MONGO_CONNECTION_URI){
        throw new Error("Mongo URI is missing");
    }
    try{
        await mongoose.connect(config.MONGO_CONNECTION_URI,ConnectOption)
        logger.info('Database connected successfully');
    }catch(error){
        logger.error('failed to connect database',error);
    }
};
//db disconnect 
const disconnectDatabase = async (): Promise<void> =>{
    try{
        await mongoose.disconnect();
        logger.info('Database disconnect successfully');
    }catch(error){
        logger.error('Error during disconnecting from database',error);
    }
};

export {connectToDatabase,disconnectDatabase};

