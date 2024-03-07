import bcrypt from 'bcryptjs';
import { generateToken } from '../auth';
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    const token = generateToken({ userId: user.id });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});


router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Senha incorreta');
    }
    const token = generateToken({ userId: user.id });
    res.json({ token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

export default router;
