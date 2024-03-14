import express from "express";
import { User } from "../models/userModel";
import { NotFoundError, isAdminUser, requireAuth } from "@farmmicro/common";

const router = express.Router();

//@desc    get all users for admin dashboard
//@api     GET /api/users/userlist
//@access  Private/ ADMIN
router.get("/api/users/userslist", isAdminUser, async (req, res) => {
  const allUser = await User.find();
  res.send(allUser);
});

export { router as getAllUserRouter };
