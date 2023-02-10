import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer } from "./utils/server.js";
import { defaultConfig } from './config/default.server.js';
import connect from './utils/connect.js';
const { app } = createServer();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
/* tslint:disable-next-line */
app.listen(defaultConfig.PORT, async () => {
    await connect();
    console.log(`SERVER listening at  ${defaultConfig.HOST}:${defaultConfig.PORT}!`);
});
export default {
    handler: app
};
//# sourceMappingURL=app.js.map