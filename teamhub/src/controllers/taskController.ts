import { Request, Response, NextFunction } from 'express';
import mongoose, { Types } from "mongoose";
import Task from '../models/Task';
import User from '../models/User';
import { TaskStatuses, TaskStatus } from "../utils/taskStatus";
import { ApiError } from "../utils/apiError";



export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await Task.find().populate("assignedTo").populate("createdBy");
        if(tasks.length == 0){
            res.status(200).json({
            success: true,
            data: tasks,
            message: "There is no task right now"
        });
        }else{
            res.status(200).json({
                success: true,
                data: tasks,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if(!id){
            return next(new ApiError(404, "Invalid Task ID"));
        }
        const tasks = await Task.findById(id).populate("assignedTo").populate("createdBy");
        if(!tasks){
            return next(new ApiError(404, "Task not found"));
        }
        
        res.status(200).json({
            success: true,
            data: tasks,
        });
        
    } catch (error) {
        next(error);
    }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            title, description, assignedTo, createdBy, status, dueDate
        } = req.body;

        if(!title || !description || !assignedTo || !createdBy || !status ){
            return next(new ApiError(404, "You must fill in all fields"));
        }
        if (!TaskStatuses.includes(status as TaskStatus)) {
            return next(new ApiError(400, `Status must be one of: ${TaskStatuses.join(", ")}`));
        }
    
        if (!mongoose.Types.ObjectId.isValid(assignedTo) || !mongoose.Types.ObjectId.isValid(createdBy)) {
            return next(new ApiError(400, "assignedTo and createdBy must be valid user IDs"));
        }
        const assignedUser = await User.findById(assignedTo);
        const creatorUser = await User.findById(createdBy);

        if (!assignedUser || !creatorUser) {
            return next(new ApiError(400, "Assigned user or creator user not found"));
        }

        let due: Date | undefined;
        if (dueDate) {
            const parsed = new Date(dueDate);
        if (isNaN(parsed.getTime())) {
            return next(new ApiError(400, "Invalid dueDate format"));
        }
        if (parsed < new Date()) {
            return next(new ApiError(400, "dueDate cannot be in the past"));
        }
        due = parsed;
        }

        const task = await Task.create({
            title,
            description,
            status: status as TaskStatus,
            assignedTo,
            createdBy,
            dueDate: due
        });

        await task.populate("assignedTo", "name email");
        await task.populate("createdBy", "name email");

        res.status(201).json({
            success: true,
            data: task,
            message: "Task created successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            id, title, description, assignedTo, createdBy, status, dueDate
        } = req.body;

        if (!id) {
            throw new ApiError(400, "Invalid Task ID");
        }

        const task = await Task.findById(id);
        if(!task){
            throw new ApiError(404, "Task not found");
        }

        if (assignedTo && assignedTo.toString() !== task.assignedTo.toString()) {
            if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
                throw new ApiError(400, "Invalid assignedTo user ID");
            }
            const existingUser = await User.findById(assignedTo);
            if (!existingUser) throw new ApiError(404, "Assigned user not found");
            task.assignedTo = assignedTo;
        }

        if (createdBy && createdBy.toString() !== task.createdBy.toString()) {
            if (!mongoose.Types.ObjectId.isValid(createdBy)) {
                throw new ApiError(400, "Invalid createdBy user ID");
            }
            const existingUser = await User.findById(createdBy);
            if (!existingUser) throw new ApiError(404, "Creator user not found");
            task.createdBy = createdBy;
            }

        if (title) task.title = title;
        if (description) task.description = description;

        if (status) {
            if (!TaskStatuses.includes(status as TaskStatus)) {
                throw new ApiError(400, `Status must be one of: ${TaskStatuses.join(", ")}`);
            }
            task.status = status as TaskStatus;
        }

        if (dueDate) {
            const parsed = new Date(dueDate);
            if (isNaN(parsed.getTime())) {
                throw new ApiError(400, "Invalid dueDate format");
            }
            if (parsed < new Date()) {
                throw new ApiError(400, "dueDate cannot be in the past");
            }
            task.dueDate = parsed;
        }

        await task.save();

        await task.populate("assignedTo", "name email");
        await task.populate("createdBy", "name email");

        res.status(200).json({
            success: true,
            data: task,
            message: "Task updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, "Invalid Task ID");
        }

        const removedTask = await Task.findByIdAndDelete(id);
        if (!removedTask) {
            throw new ApiError(404, "Task not found");
        }

        res.status(200).json({
            success: true,
            data: removedTask,
            message: "Task deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};