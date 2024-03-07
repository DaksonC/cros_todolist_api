import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../auth';

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticate);

// Defina suas rotas do TodoList aqui...

export default router;
