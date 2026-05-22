/**
 * @copyright
 * @license Apache-2.0
 */

import dotenv from 'dotenv';

dotenv.config();
//constants
const CORS_WHITELIST = ['https://Long2Short.dumidusahan.com'];


const config = {
    PORT: process.env.PORT!,
    NODE_ENV: process.env.NODE_ENV!,
    CORS_WHITELIST,
};

export default config;