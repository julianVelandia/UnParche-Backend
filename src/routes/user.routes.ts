import { Router } from "express";

import { validateJwt } from "../middlewares/validate-jwt";
import { getAllUsers,Register,loginUser, updateUser } from "../controllers/user.controller";

const router = Router();

// get
// post
// put
// delete

router.get("/", getAllUsers);
router.post("/register", Register);
router.post("/login", loginUser);
router.post("/update", updateUser);

export default router;
