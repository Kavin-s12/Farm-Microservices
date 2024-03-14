import express from "express";
import { User } from "../models/userModel";
import { NotFoundError, requireAuth } from "@farmmicro/common";

const router = express.Router();

//@desc    update user profile
//@api     PUT /api/users/:id
//@access  Private
router.put("/api/users/:id", requireAuth, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { name, email, isAdmin } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  if (isAdmin === false || isAdmin === true) {
    user.isAdmin = isAdmin;
  }

  await user.save();
  res.send(user);
});

export { router as updateProfileByIdRouter };
