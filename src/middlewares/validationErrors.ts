/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */

import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validationError = (req :Request, res:Response, next :NextFunction): void =>{
   //console.log('req.body:', req.body); 
    const errors = validationResult(req);

    if (!errors.isEmpty()){
     //   console.log('errors:', errors.array());  

        res.status(400).json({
            code : 'validationError',
            erros: errors.mapped()
        });
        return;
    }
    next();
;}

export default validationError;
