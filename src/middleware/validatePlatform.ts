import express, { Response, Request, NextFunction } from 'express';
import { PlatformParamsSchema } from '../schema/platform';

export function validatePlatform(req : Request, res : Response, next : NextFunction) {
   
    if (typeof req.params.platform === "string") {
        req.params.platform = req.params.platform.toLowerCase(); 
    }

    const parsed = PlatformParamsSchema.safeParse(req.params); 

    if (!parsed.success) {
        return res.status(400).json({ error: "Platofrm must be one of spotify, apple, youtube" }); 
    }
    
    (req as any).platform = parsed.data.platform

    next(); 
}