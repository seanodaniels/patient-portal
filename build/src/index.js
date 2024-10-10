"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const patientor_1 = __importDefault(require("./routes/patientor"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.use(express_1.default.static('dist'));
app.use(express_1.default.json());
// const PORT = 3001
console.log(`process.env.PORT is ${process.env.PORT}`);
const PORT = process.env.PORT || 3001;
app.get('/api/ping', (_req, res) => {
    console.log('ping received');
    res.send('pong');
});
// app.use('/api/diagnoses', patientorRouter)
app.use('/api', patientor_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
