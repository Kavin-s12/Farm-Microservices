import express from "express";
import { User } from "../models/userModel";
import { NotFoundError, requireAuth } from "@farmmicro/common";

const router = express.Router();

//@desc    get user profile
//@api     GET /api/users/profile
//@access  Private
router.get("/api/users/profile", requireAuth, async (req, res) => {
  const user = await User.findById(req.currentUser!.id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.send(user);
});

export { router as getProfileRouter };
