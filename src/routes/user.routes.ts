import { Router } from "express";
import { getAllUsers,Register, Update, Delete } from "../controllers/user.controller";
const router = Router();

// get
// post
// put
// delete

router.get("/", getAllUsers);
router.post("/register", Register);
router.put("/update/:id", Update);
router.delete("/delete/:id", Delete);
export default router;
