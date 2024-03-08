import bcrypt from 'bcryptjs';
import { generateToken } from '../auth';
import { User } from '../entitys/user';
import express, { Request, Response } from 'express';
import { AppDataSource } from '../infra/database/data-source';

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword
    });

    await userRepository.save(newUser);

    const token = generateToken({ userId: newUser.id });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Senha incorreta');
    }

    const token = generateToken({ userId: user.id });
    res.json({ token, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Erro ao fazer login' });
  }
});

export default router;
