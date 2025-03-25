"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DashboardController2_1 = require("../controllers/DashboardController2");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", DashboardController2_1.getDashboardMetrics);
exports.default = router;
