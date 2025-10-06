import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import Role from "../models/Role";
import { env } from "../config/config";
import { PERMISSIONS } from "../utils/permissions";

const seed = async () => {
    try {
        console.log("Seed başlıyor...");
        await mongoose.connect(env.MONGO_URI);
        console.log("MongoDB connected");

        let superAdminRole = await Role.findOne({ name: "SuperAdmin" });
        if (!superAdminRole) {
            superAdminRole = new Role({
                name: "SuperAdmin",
                permissions: Object.values(PERMISSIONS), 
        });
        await superAdminRole.save();
        console.log("SuperAdmin role created");
        }

        const existingAdmin = await User.findOne({ email: "admin@example.com" });
        if (!existingAdmin) {
            const hashedPassword = bcrypt.hashSync("123456", 10);
            const adminUser = new User({
                name: "Super Admin",
                email: "admin@example.com",
                password: hashedPassword,
                roles: [superAdminRole._id],
        });
        await adminUser.save();
        console.log("Super admin user created with email: admin@example.com / password: 123456");
        } else {
        console.log("Super admin already exists");
        }

        await mongoose.disconnect();
        console.log("Seed tamamlandı!");
    } catch (err) {
        console.error(err);
        await mongoose.disconnect();
    }
};

seed();
