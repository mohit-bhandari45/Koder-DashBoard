import { Router } from "express";
import problemRoutes from "./problems/problem.route";

const router = Router();

router.use("/problems", problemRoutes);

export default router;