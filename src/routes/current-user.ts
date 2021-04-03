import express, { Request, Response } from "express";

import { currentUser } from "@oldledger/common";
// import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  (req: Request, res: Response) => {
    // FIXME: We really should validate this user against the db, and not just trust the data from the cookie
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
