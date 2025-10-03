import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Role from '../models/Role';
import { ApiError } from "../utils/apiError";
import { Types } from "mongoose";


export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().populate("roles");

        if(users.length === 0){
            return next(new ApiError(404, "User not found"));
        }
        res.status(200).json({
            success: true,
            data: users,
        })
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate("roles");

        if(!user){
            return next(new ApiError(404, "User not found"));
        }
        res.status(200).json({
            success: true,
            data: user,
        })
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const{
            name, email, password, roles
        } = req.body;
        
        if(!name || !email || !password || !roles ){
            return next(new ApiError(404, "You must fill in all fields"));
        }
        
        const exsistingEmail = await User.findOne({email});
        if(exsistingEmail){
            return next(new ApiError(404, "This email is already in use"));
        }

        const roleDocs = await Role.find({ name: { $in: roles } });
        const roleIds = roleDocs.map(r => r._id);
        if(roleIds.length === 0){
            return next(new ApiError(404, "No such role was found"));
        }

        const newUser = new User({
            name, email, password, roles: roleIds
        });
        await newUser.save();
        res.status(201).json({
            success: true,
            data: newUser,
        })
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name, email, roles } = req.body;

        if (!id) {
            throw new ApiError(400, "Invalid user ID");
        }

        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                throw new ApiError(400, "This email is already in use");
            }
            user.email = email;
        }

        if (name) user.name = name;

        if (roles) {
            if (!Array.isArray(roles)) {
                throw new ApiError(400, "Roles must be an array of role names");
            }
            const roleDocs = await Role.find({ name: { $in: roles } });
            if (roleDocs.length !== roles.length) {
                throw new ApiError(400, "Some roles are invalid");
            }
            const roleIds = roleDocs.map(r => r._id as Types.ObjectId);
            user.roles = roleIds;
        }

        const updatedUser = await user.save();
        await updatedUser.populate("roles"); 
        const userResponse = updatedUser.toObject();
    
        res.status(200).json({
        success: true,
        data: userResponse,
        message: "User updated successfully"
        });
    } catch(error) {
        next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { id } = req.params;

        if (!oldPassword || !newPassword) {
            throw new ApiError(400, "Both old and new passwords are required");
        }

        if (newPassword.length < 6) {
            throw new ApiError(400, "New password must be at least 6 characters long");
        }

        const user = await User.findById(id);
        if (!user) throw new ApiError(404, "User not found");

        if (user.password !== oldPassword) {
            throw new ApiError(400, "Old password is incorrect");
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const{ id } = req.body;
        if(!id){
            return next(new ApiError(400, "User id cannot be empty" ));
        }
        
        const removedUser = await User.findByIdAndDelete(id);
        if(!removedUser){
            return next(new ApiError(404, "User not found"));
        }
        res.status(200).json({
            success: true,
            data: removedUser,
            message: "User deleted succesfully"
        });
    } catch (error) {
        next(error);
    }
};