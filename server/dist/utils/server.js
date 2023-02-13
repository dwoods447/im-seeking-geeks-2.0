import express, { Router } from 'express';
import authRoutes from '../routes/auth.routes.js';
import profileRoutes from '../routes/profile.routes.js';
export default function createServer() {
    const app = express();
    const router = Router();
    authRoutes(app);
    profileRoutes(app);
    return {
        app,
        router
    };
}
//# sourceMappingURL=server.js.map