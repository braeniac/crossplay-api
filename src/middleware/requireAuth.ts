import type { Request, Response, NextFunction } from 'express';

export function requireAuth(req : Request, res : Response, next : NextFunction) {

    const userId = (req as any).user?.id || (req as any).auth?.userId; 
    
    if (!userId) {
        return res.status(400).json({ error : "Not authenticated" }); 
    }

    (req as any).currentUserId = userId; 
    
    next(); 
}