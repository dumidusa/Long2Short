/**
 * @copyright 2026 dumidu sahan
 * @license Apache-2.0
 */
import rateLimit, { type RateLimitRequestHandler, type Options } from 'express-rate-limit';
import config from '@/config';

type RateLimitType = 'basic' | 'auth' | 'passReset';

const defaultLimitOpt: Partial<Options> = {
    windowMs: config.WINDOW_MS,
    legacyHeaders: false,
    standardHeaders: true,
};

const rateLimitOpt = new Map<RateLimitType, Partial<Options>>([
    ['basic',     { ...defaultLimitOpt, limit: 100 }],
    ['auth',      { ...defaultLimitOpt, limit: 10  }],
    ['passReset', { ...defaultLimitOpt, limit: 3   }],
]);

const expressRateLimit = (type: RateLimitType): RateLimitRequestHandler => {
    const options = rateLimitOpt.get(type);
    if (!options) throw new Error(`Unknown rate limit type: ${type}`);
    return rateLimit(options);
};

export default expressRateLimit;