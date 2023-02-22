import cors from 'cors';
import bodyParser from 'body-parser';
import express, { Router } from 'express';
import authRoutes from '../routes/auth.routes.js';
import profileRoutes from '../routes/profile.routes.js';
export default function createServer() {
    const app = express();
    const router = Router();
    app.use(cors());
    // parse application/json
    app.use(bodyParser.json());
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
    authRoutes(app);
    profileRoutes(app);
    return {
        app,
        router
    };
}
//# sourceMappingURL=server.js.map