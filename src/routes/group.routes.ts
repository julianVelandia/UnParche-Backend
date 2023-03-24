import { Router } from "express";
import { getAllGroups,Register,Delete,Update } from "../controllers/group.controller";
const router = Router();

// get
// post
// put
// delete

router.get("/", getAllGroups);
router.post("/register", Register);
router.delete("/delete/:id",Delete);
router.put("/update/:id",Update);
export default router;
