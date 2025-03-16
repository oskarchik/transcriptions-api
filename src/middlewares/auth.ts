import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { ApiError } from '../error/ApiError';

const USER_POOL_ID = process.env.USER_POOL_ID as string;
const AWS_REGION = process.env.AWS_REGION as string;
interface User {
  sub: string;
  email: string;
}
const client = jwksClient({
  jwksUri: `https://cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
});

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.error('missing token');
    return next(ApiError.unauthorized());
  }

  jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      console.log('🚀 ~ jwt.verify ~ err:', err);

      return next(ApiError.unauthorized());
    }

    // might want to save decoded info in req
    next();
  });
}

function getKey(
  header: jwt.JwtHeader,
  callback: (err: Error | null, key?: string) => void,
): void {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.log('🚀 ~ client.getSigningKey ~ err:', err);
      return callback(err);
    }

    const signingKey =
      (key as jwksClient.RsaSigningKey).getPublicKey() ||
      (key as jwksClient.RsaSigningKey).rsaPublicKey;

    callback(null, signingKey);
  });
}
