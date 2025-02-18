import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import { expressjwt as jwt, Params } from "express-jwt";
import { Algorithm } from "jsonwebtoken";
import jwks from "jwks-rsa";
import { InfrastructureException } from "../../../infrastructure/exceptions/InfrastructureException";

dotenv.config();


export class AuthMiddleware {
  private static getJwtOptions(): Params {
    if (!process.env.COGNITO_REGION || !process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_CLIENT_ID) {
      throw new InfrastructureException("Configurações do Cognito ausentes");
    }

    return {
      secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
      }) as jwks.GetVerificationKey,
      audience: process.env.COGNITO_CLIENT_ID,
      issuer: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
      algorithms: ["RS256"] as Algorithm[],
    };
  }

  public static getMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      jwt(AuthMiddleware.getJwtOptions())(req, res, (err) => {
        if (err) {
          console.error("Erro na autenticação:", err);
          if (err.name === "UnauthorizedError") {
            return res.status(401).json({ message: "Token inválido ou não autorizado", error: err.message });
          }
          return res.status(500).json({ message: "Erro interno na autenticação", error: err.message });
        }
        next();
      });
    };
  }
}
