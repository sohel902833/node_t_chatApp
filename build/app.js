"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var cors_1 = __importDefault(require("cors"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var db_1 = require("./db");
var attatchment_routes_1 = require("./routes/attatchment.routes");
var auth_routes_1 = require("./routes/auth.routes");
var conversation_routes_1 = require("./routes/conversation.routes");
var user_routes_1 = require("./routes/user.routes");
var app = (0, express_1.default)();
exports.app = app;
dotenv_1.default.config();
(0, db_1.connectDb)();
//ignore cors policy
app.use((0, cors_1.default)());
//to parse json data
app.use(express_1.default.json());
app.use("/uploads/", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.get("/health", function (req, res) {
    res.status(200).json({
        message: "App running fine",
    });
});
app.use("/auth", auth_routes_1.router);
app.use("/user", user_routes_1.router);
app.use("/conversation", conversation_routes_1.router);
app.use("/attatchment", attatchment_routes_1.router);
