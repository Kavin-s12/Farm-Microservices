import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/userModel";
import { BadRequestError } from "@farmmicro/common";
import { validateRequest } from "@farmmicro/common";
import { Password } from "../services/password-srv";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must enter the password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid email or password");
    }
    const passwordMatch = await Password.compare(
      password,
      existingUser.password
    );

    if (passwordMatch) {
      const userJwt = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
          isAdmin: existingUser.isAdmin,
        },
        process.env.JWT_KEY!,
        { expiresIn: "12h" }
      );

      req.session = {
        jwt: userJwt,
      };
      res.status(200).send(existingUser);
    } else {
      throw new BadRequestError("Invalid email or password");
    }
  }
);

export { router as signinRouter };
