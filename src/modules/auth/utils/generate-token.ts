import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import ms from "ms";

import { envConfig } from "@/config/env/index.js";
import type { JwtPayload } from "../types/auth.types.js";
import { TOKEN_TYPE } from "../constants/auth.constants.js";

/**
 * Parameters required to generate a JWT token
 */
type GenerateTokenParams = {
    payload: JwtPayload;
    secret: string
    expiresIn: SignOptions["expiresIn"]
}

/**
 * Generate a signed JWT token based on the provided payload and token type
 * 
 * @param payload - data to encode inside JWT
 * @param type - type of token (access | refresh)
 * @returns a signed JWT string
 * @throw error for invalid token type 
 * Use jwt.sign(payload, secret, options) to create the token
 */
// export const generateToken = ({ payload, type }: GenerateTokenParams): string => {
//     let secret: string;
//     let expiresIn: SignOptions["expiresIn"];

//     switch (type) {
//         case "ACCESS":
//             secret = envConfig.jwt.access.secret;
//             expiresIn = envConfig.jwt.access.expiresIn;
//             break;

//         case "REFRESH":
//             secret = envConfig.jwt.refresh.secret;
//             expiresIn = envConfig.jwt.refresh.expiresIn;
//             break;

//         default:
//             throw new Error("Invalid token type");
//     }

//     return jwt.sign(payload, secret, { expiresIn });
// }

export const generateToken = ({ payload, secret, expiresIn }: GenerateTokenParams): string => {
    return jwt.sign(payload, secret, { expiresIn: expiresIn as ms.StringValue });
};