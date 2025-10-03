import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/config";
import User, { IUser } from "../models/User";
import { IRole } from "../models/Role";
import { Types } from "mongoose";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email?: string;
        name?: string;
        roles?: string[];
    };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const payload = jwt.verify(token, env.JWT_SECRET) as { id: string };

        const user = await User.findById(payload.id).populate<{ roles: IRole[] }>("roles");
        if (!user) return res.status(401).json({ message: "User not found" });

        const userId = (user._id as unknown as Types.ObjectId).toString();

        const roles = (user.roles as unknown as IRole[]).map(r => r.name);

        req.user = {
            id: userId,
            email: user.email,
            name: user.name,
            roles,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
