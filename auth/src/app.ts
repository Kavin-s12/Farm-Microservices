import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { currentUser, errorHandler } from "@farmmicro/common";
import { NotFoundError } from "@farmmicro/common";
import { getProfileRouter } from "./routes/get-profile";
import { getAllUserRouter } from "./routes/get-all-users";
import { updateProfileRouter } from "./routes/update-profile";
import { getUserByIdRouter } from "./routes/get-user-by-id";
import { updateProfileByIdRouter } from "./routes/update-user-by-id";

const app = express();
app.set("trust proxy", true);
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(express.json());

app.use(updateProfileRouter);
app.use(currentUserRouter);
app.use(getAllUserRouter);
app.use(getProfileRouter);
app.use(getUserByIdRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(updateProfileByIdRouter);

app.use(signupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError("Route not found");
});

app.use(errorHandler);

export { app };
