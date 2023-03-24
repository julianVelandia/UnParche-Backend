import { Router } from "express";
import { getAllUsers,Register } from "../controllers/user.controller";
const router = Router();

// get
// post
// put
// delete

router.get("/", getAllUsers);
router.post("/register", Register);

export default router;
