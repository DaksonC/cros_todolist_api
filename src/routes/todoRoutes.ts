import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../auth';

const prisma = new PrismaClient();
const router = express.Router();

router.use(authenticate);

// Criar uma nova task
router.post('/tasks', async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.body.userId;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: false,
        userId
      }
    });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar task' });
  }
});

// Listar todas as tasks do usuário
router.get('/tasks', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const tasks = await prisma.task.findMany({
      where: {
        userId
      }
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar tasks' });
  }
});

// Editar uma task específica
router.put('/tasks/:taskId', async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const { title, description, status } = req.body;
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        status
      }
    });
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar task' });
  }
});

// Deletar uma task específica
router.delete('/tasks/:taskId', async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.taskId);
    await prisma.task.delete({
      where: { id: taskId }
    });
    res.json({ message: 'Task excluída com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir task' });
  }
});

// Marcar uma task como concluída
router.put('/tasks/:taskId/complete', async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: true
      }
    });
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao marcar task como concluída' });
  }
});

// Desmarcar uma task como concluída
router.put('/tasks/:taskId/uncomplete', async (req: Request, res: Response) => {
  try {
    const taskId = parseInt(req.params.taskId);
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: false
      }
    });
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao desmarcar task como concluída' });
  }
});

// Filtrar tasks pelo status
router.get('/tasks/:status', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const status = req.params.status === 'completed';
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        status
      }
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao filtrar tasks' });
  }
});

export default router;
