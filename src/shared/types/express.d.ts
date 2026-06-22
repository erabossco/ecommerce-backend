import type { RequestUser } from "@/modules/auth/types/auth.types.js";


/**
 * Global Express augmentation: 
 * adds optional authenticated user (req.user) 
 * populated by auth middleware after JWT verification
 */

declare global {
    namespace Express {
        interface Request {
            user?: RequestUser
        }
    }
}
export { }