import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { errorHandler } from "./middlewares/error";
import fs from "fs";
import path from "path";
import redisClient from "./config/redis";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const routesPath = path.join(__dirname, "routes");

fs.readdirSync(routesPath).forEach((file) => {
  if (file.endsWith("Routes.ts") || file.endsWith("Routes.js")) {
    const routeModule = require(path.join(routesPath, file));
    const router = routeModule.default || routeModule; 
    if (typeof router !== "function") {
      console.warn(`Router in ${file} is not a valid express router. Skipping.`);
      return;
    }

    const routeName =
      "/" + file.replace("Routes.ts", "").replace("Routes.js", "");
    app.use(`/api${routeName}`, router);
    console.log(`Route loaded: /api${routeName}`);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("TeamHub API çalışıyor!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
