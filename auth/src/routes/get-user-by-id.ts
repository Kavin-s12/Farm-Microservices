import express from "express";
import { User } from "../models/userModel";
import { NotFoundError, isAdminUser } from "@farmmicro/common";

const router = express.Router();

//@desc    get user profile
//@api     GET /api/users/:id
//@access  Private Admin
router.get("/api/users/:id", isAdminUser, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.send(user);
});

export { router as getUserByIdRouter };
