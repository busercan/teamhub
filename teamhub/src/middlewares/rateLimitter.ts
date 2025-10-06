import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';

interface RateLimitOptions {
    windowSeconds: number; 
    maxRequests: number;   
}

export const rateLimiter = (options: RateLimitOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
            const key = `rate:${ip}:${req.originalUrl}`;

            const requests = await redisClient.incr(key);

            if (requests === 1) {
                await redisClient.expire(key, options.windowSeconds);
            }

            if (requests > options.maxRequests) {
                return res.status(429).json({
                    success: false,
                    message: `Çok fazla istek yapıldı. Lütfen ${options.windowSeconds / 60} dakika bekleyin.`
                });
            }

            next();
            } catch (err: any) {
                console.error('Rate limiter error:', err);
                res.status(500).json({
                    success: false,
                    message: 'Rate limiter çalışırken bir hata oluştu.'
            });
        }
    };
};
