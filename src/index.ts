import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import groupsRoutes from "./routes/group.routes";
import dotenv from "dotenv";

dotenv.config();

import "./config/database";

const app = express();

app.set("port", 4000);

app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/groups", groupsRoutes);
app.listen(app.get("port"), () => {
  console.log("hola corriendo en http://localhost:4000");
});
