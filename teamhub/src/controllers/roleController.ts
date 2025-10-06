import { Request, Response, NextFunction } from 'express';
import Role from '../models/Role';
import { ApiError } from '../utils/apiError';

export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await Role.find();

    if (roles.length === 0) {
      return next(new ApiError(404, 'Role not found'));
    }

    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (err) {
    next(err);
  }
};

export const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return next(new ApiError(400, 'Role ID parameter is missing'));
    }

    const role = await Role.findById(id);
    if (!role) {
      return next(new ApiError(404, 'Role not found'));
    }

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (err) {
    next(err);
  }
};

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, permissions } = req.body;

    if (!name) {
      return next(new ApiError(400, 'Role name cannot be empty'));
    }

    const existingRoleName = await Role.findOne({ name });
    if (existingRoleName) {
      return next(new ApiError(400, 'Role name already exists'));
    }

    const newRole = new Role({
      name,
      permissions,
    });
    await newRole.save();

    res.status(201).json({
      success: true,
      data: newRole,
      message: 'Role created succesfully',
    });
  } catch (err) {
    next(err);
  }
};

export const updateRoleName = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name } = req.body;

    if (!id) {
      return next(new ApiError(400, 'Role id cannot be empty'));
    }

    let updatedname;
    if (name) updatedname = name;
    const updatedRole = await Role.findByIdAndUpdate(id, { name: updatedname }, { new: true });
    if (!updatedRole) {
      return next(new ApiError(400, 'Role not found'));
    }

    res.status(200).json({
      success: true,
      data: updatedRole,
      message: 'Role name updated succesfully',
    });
  } catch (err) {
    next(err);
  }
};

export const addPermissionToRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, permissions } = req.body;

    if (!id) {
      return next(new ApiError(400, 'Role id cannot be empty'));
    }
    if (!Array.isArray(permissions) || permissions.length == 0) {
      return next(new ApiError(400, 'Permissions must be a non-empty array'));
    }

    const rolepermissions = await Role.findByIdAndUpdate(
      id,
      { $addToSet: { permissions: { $each: permissions } } },
      { new: true }
    );
    if (!rolepermissions) {
      return next(new ApiError(400, 'Role not found'));
    }

    res.status(200).json({
      success: true,
      data: rolepermissions,
      message: 'Permission added succesfully',
    });
  } catch (err) {
    next(err);
  }
};

export const deletePermissionToRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, permissions } = req.body;

    if (!id) {
      return next(new ApiError(400, 'Role id cannot be empty'));
    }
    if (!Array.isArray(permissions) || permissions.length == 0) {
      return next(new ApiError(400, 'Permissions must be a non-empty array'));
    }

    const rolepermissions = await Role.findByIdAndUpdate(
      id,
      { $pull: { permissions: { $in: permissions } } },
      { new: true }
    );
    if (!rolepermissions) {
      return next(new ApiError(400, 'Role not found'));
    }

    res.status(200).json({
      success: true,
      data: rolepermissions,
      message: 'Permission deleted succesfully',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;
    if (!id) {
      return next(new ApiError(400, 'Role id cannot be empty'));
    }

    const removedRole = await Role.findByIdAndDelete(id);

    if (!removedRole) {
      return next(new ApiError(404, 'Role not found'));
    }

    res.status(200).json({
      success: true,
      data: removedRole,
      message: 'Role deleted succesfully',
    });
  } catch (err) {
    next(err);
  }
};
