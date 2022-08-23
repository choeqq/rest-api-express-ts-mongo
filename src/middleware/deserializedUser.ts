import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import { verifyJwt } from "../utils/jwt.utils";

const deserializedUser = (req: Request, res: Response, next: NextFunction) => {
  const accesssToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  if (!accesssToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accesssToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  return next();
};

export default deserializedUser;
