import express from 'express';
import { getDashboardMetrics} from '../controllers/DashboardController2'
import {Router} from "express";
const router = Router();

router.get("/",getDashboardMetrics);
export default router;

