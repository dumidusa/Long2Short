/**
 * @copyright 2026 dumidusahan
 * @license Apache-2.0
 * 
 * 
 */

//custom module
import config from '@/config';

//types
import type { CorsOptions } from 'cors';

//cors configuration options
const corsOptions: CorsOptions={
    //custom origin validation function
    origin(requestOrigin, callback){
        //allow the request if origin exists and is in the whitelist
        if(requestOrigin && config.CORS_WHITELIST.includes(requestOrigin)){
            callback(null, true);
        }else{
            callback(
                config.NODE_ENV === 'development' ? null : new Error('NOT ALLOWED BY CORS!....')
            )
        }
    }
}

export default corsOptions;