import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/teamhub",
  JWT_SECRET: process.env.JWT_SECRET || "defaultsecret",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "1h",
};
