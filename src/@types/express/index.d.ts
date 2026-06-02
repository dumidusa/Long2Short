/**
 * @copyright 2026 dumidu sahan 
 * @license Apache-2.0
 */

//types
import {Types} from "mongoose";

declare global{
    namespace Express{
        interface Request{
            userId?: Types.ObjectId;
        }
    }
}

export {};