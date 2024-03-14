import express, { Request, Response } from "express";
import { User } from "../models/userModel";
import { body } from "express-validator";
import { BadRequestError } from "@farmmicro/common";
import jwt from "jsonwebtoken";
import { validateRequest } from "@farmmicro/common";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 10 })
      .withMessage("Password must be batween 4 and 10 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, email, password, isAdmin } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      throw new BadRequestError("Email in use");
    }

    const user = User.build({
      name,
      email,
      password,
      isAdmin: isAdmin || false,
    });

    await user.save();

    const userJwt = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY!,
      { expiresIn: "1h" }
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
