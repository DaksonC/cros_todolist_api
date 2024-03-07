import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken, verifyToken } from './auth';

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());

app.post('/signup', async (req: Request, res: Response) => {
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

app.post('/login', async (req: Request, res: Response) => {
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

function authenticate(req: Request, res: Response, next: () => void) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  try {
    const decoded = verifyToken(token);
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
}

app.use(authenticate);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
