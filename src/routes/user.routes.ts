import { Router } from "express";

import { validateJwt } from "../middlewares/validate-jwt";
import { getAllUsers,Register,loginUser } from "../controllers/user.controller";
import { getGroupsfromUser  } from "../controllers/group.controller";

const router = Router();

// get
// post
// put
// delete

router.get("/", getAllUsers);
router.post("/register", Register);
router.post("/login", loginUser);
router.get("/your-groups", getGroupsfromUser);

export default router;
