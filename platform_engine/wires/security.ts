import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';

const SECRET_PHRASE = process.env.CORE_SECRET || 'fallback_secret_phrase_do_not_use_in_prod';

// --- Cryptography Modules ---

export const encryptSecret = async (plain: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(plain, salt);
};

export const validateSecret = async (plain: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(plain, hash);
};

// --- Token Logistics ---

export const issueAccessPass = (userId: string, role: string): string => {
    return jwt.sign({ uid: userId, role: role }, SECRET_PHRASE, { expiresIn: '12h' });
};

export const verifyAccessPass = (token: string): any => {
    try {
        return jwt.verify(token, SECRET_PHRASE);
    } catch (e) {
        return null;
    }
};

// --- Gatekeeper Middleware ---

export interface ProtectedRequest extends Request {
    user_checkpoint?: any;
}

export const activeSessionGuard = (req: ProtectedRequest, res: Response, next: NextFunction) => {
    const rawHeader = req.headers.authorization;

    if (!rawHeader || !rawHeader.startsWith('Bearer ')) {
        return res.status(401).json({ signal: 'DENIED', reason: 'Missing Authorization Credential' });
    }

    const token = rawHeader.split(' ')[1];
    const payload = verifyAccessPass(token);

    if (!payload) {
        return res.status(403).json({ signal: 'DENIED', reason: 'Invalid or Expired Credential' });
    }

    req.user_checkpoint = payload;
    next();
};

export const verifiedFounderGuard = (req: ProtectedRequest, res: Response, next: NextFunction) => {
    // This assumes the user object or verification status is fetched or encoded. 
    // Ideally we might check DB here, but for now we check the payload role or trust the previous guard to have loaded context if we extended it.
    // However, the prompt asks for specific validation. Let's assume we fetch user in a real app, 
    // or we encode 'is_vetted' in token? Let's encode role.
    // If we only have role 'founder' = vetted. 'initiate' = not vetted.

    // We strictly check the checkpoint exists
    if (!req.user_checkpoint) {
        return res.status(401).json({ signal: 'DENIED', reason: 'Identification Required' });
    }

    if (req.user_checkpoint.role !== 'founder' && req.user_checkpoint.role !== 'admin') {
        return res.status(403).json({ signal: 'BLOCKED', reason: 'Asset Locked: Verification Required' });
    }

    next();
};
