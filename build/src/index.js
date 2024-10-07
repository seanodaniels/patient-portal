"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const patientor_1 = __importDefault(require("./routes/patientor"));
const app = (0, express_1.default)();
const cors = require('cors');
app.use(express_1.default.json());
const PORT = 3001;
app.use(cors());
app.get('/api/ping', (_req, res) => {
    console.log('ping received');
    res.send('pong');
});
// app.use('/api/diagnoses', patientorRouter)
app.use('/api', patientor_1.default);
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
