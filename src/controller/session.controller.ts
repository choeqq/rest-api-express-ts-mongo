import { Request, Response } from "express";
import { createSession, findSessions } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";
import config from "config";

export async function createUserSessionHandler(req: Request, res: Response) {
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  const session = await createSession(user._id, req.get("user-agent") || "");

  const accesssToken = signJwt(
    { ...user, session: session._id },
    {
      expiresIn: config.get("accessTokenTtl"),
    }
  );

  const refreshToken = signJwt(
    { ...user, session: session._id },
    {
      expiresIn: config.get("accessTokenTtl"),
    }
  );

  return res.send({ accesssToken, refreshToken });
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}
