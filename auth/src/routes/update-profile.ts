import express from "express";
import { User } from "../models/userModel";
import { NotFoundError, requireAuth } from "@farmmicro/common";

const router = express.Router();

//@desc    update user profile
//@api     PUT /api/users/profile
//@access  Private
router.put("/api/users/profile", requireAuth, async (req, res) => {
  const user = await User.findById(req.currentUser!.id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { name, email, password } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  if (password) {
    user.password = password;
  }

  await user.save();
  res.send(user);
});

export { router as updateProfileRouter };
