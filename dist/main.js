"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const app_conf_1 = require("./configs/app.conf");
const MongoDB_database_1 = __importDefault(require("./databases/MongoDB.database"));
console.log('Connecting to database...');
new MongoDB_database_1.default()
    .connect()
    .then(() => {
    console.log('Connected to database');
    app_1.default.listen(app_conf_1.PORT, () => {
        console.log(`Express server is running on http://localhost:${app_conf_1.PORT}.`);
    });
})
    .catch((error) => {
    console.error('Failed to connect to database: ', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map