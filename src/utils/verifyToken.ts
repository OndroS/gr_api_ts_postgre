import jwt from 'jsonwebtoken';

import { Request as ExpressRequest, Response, NextFunction } from 'express';

interface UserPayload { // TODO: Finish definition
  // Define the properties of the user payload here, for example:
  id: number;
  username: string;
  // ... other properties
}

// Extend the Express Request type
interface RequestWithUser extends ExpressRequest {
  user?: UserPayload;
}

function verify(req: RequestWithUser, res: Response, next: NextFunction): void {
  const authHeader = req.headers.token as string | undefined;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.SECRET_KEY as string, (err: any, user: UserPayload) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
}

export default verify;