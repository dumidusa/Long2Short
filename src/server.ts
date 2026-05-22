/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */

// node modules

import express from "express";

//custom modules
import config from '@/config';

const server = express();

server.get('/',(req,res)=>{
    res.json({message: 'hello world'});
})
//start the server 
server.listen(config.PORT, ()=>{
    console.log(`server listening @ http://localhost : ${config.PORT}`);
})