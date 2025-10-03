import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/config";
import User, { IUser } from "../models/User";
import Role, { IRole } from "../models/Role";
import { Types } from "mongoose";

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email?: string;
        name?: string;
        roles?: string[]; // ObjectId stringleri
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

        req.user = {
            id: (user._id as Types.ObjectId).toString(), // <-- tip dönüşümü
            email: user.email,
            name: user.name,
            roles: (user.roles as IRole[]).map(r => (r._id as Types.ObjectId).toString()), // <-- tip dönüşümü
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const authorize = (requiredPermission: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        // req.user.roles string array, ObjectId stringleri ile sorgula
        const roles = await Role.find({ _id: { $in: req.user.roles } });
        const userPermissions = roles.flatMap(r => r.permissions);

        if (!userPermissions.includes(requiredPermission)) {
            return res.status(403).json({ message: "Forbidden: insufficient rights" });
        }

        next();
    };
};
