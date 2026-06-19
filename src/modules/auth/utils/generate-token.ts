import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import type { JwtPayload } from "../types/auth.types.js";

/**
 * Parameters required to generate a JWT token
 */
type GenerateTokenParams = {
    payload: JwtPayload;
    secret: string;
    expiresIn: NonNullable<SignOptions["expiresIn"]>;
}

/**
 * Generate a signed JWT token
 *
 * @param payload - Data to encode inside the JWT
 * @param secret - Secret key used to sign the token
 * @param expiresIn - Token expiration time
 * @returns A signed JWT string
 */

export const generateToken = ({ payload, secret, expiresIn }: GenerateTokenParams): string => {

    return jwt.sign(
        {
            ...payload,
            // Unique identifier for each JWT.
            // Prevents duplicate tokens during fast refresh rotation
            // where payload + iat could otherwise generate the same JWT.
            jti: crypto.randomUUID(),
        },
        secret,
        { expiresIn },
    );
};