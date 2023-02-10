var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer } from "./utils/server.js";
import { defaultConfig } from './config/default.server.js';
const { router, app } = createServer();
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
/* tslint:disable-next-line */
app.listen(defaultConfig.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    // await connect();
    console.log(`SERVER listening at  ${defaultConfig.HOST}:${defaultConfig.PORT}!`);
}));
export default {
    handler: app
};
//# sourceMappingURL=app.js.map