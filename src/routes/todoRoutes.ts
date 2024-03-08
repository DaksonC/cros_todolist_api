import express, { Request, Response } from 'express';
import { Task } from '../entitys/task';
import { authenticate } from '../auth';
import { AppDataSource } from '../infra/database/data-source';
import { Like } from 'typeorm';

const router = express.Router();
const taskRepository = AppDataSource.getRepository(Task);

router.use(authenticate);

router.post('/tasks', async (req: Request, res: Response) => {
  try {
    const { title, description, userId, subtasks } = req.body;
    const newTask = taskRepository.create({
      title,
      description,
      status: false,
      userId
    });
    const savedTask = await taskRepository.save(newTask);

    res.json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar task' });
  }
});

router.get('/tasks', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const tasks = await taskRepository.find({
      where: { userId },
      relations: {
        parentTask: true,
      },
    });

    const topLevelTasks = tasks.filter(task => !task.parentTask);

    function addSubtasks(task: Task) {
      const subtasks = tasks.filter(subtask => subtask.parentTask && subtask.parentTask.id === task.id);

      if (subtasks.length > 0) {
        task.subtasks = subtasks.map(subtask => addSubtasks(subtask));
      }

      return task;
    }

    const tasksWithSubtasks = topLevelTasks.map(task => addSubtasks(task));

    res.json(tasksWithSubtasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao listar tasks' });
  }
});

router.put('/tasks/:taskId', async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const { title, description, status, subtasks } = req.body;
    const task = await taskRepository.findOne({ where: { id: Like(taskId) }, relations: ['subtasks'] });

    if (!task) {
      return res.status(404).json({ error: 'Task não encontrada' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status !== undefined ? status : task.status;

    if (subtasks && subtasks.length > 0) {
      await Promise.all(subtasks.map(async (subtaskData: any) => {
        const subtaskId = subtaskData.id;
        await taskRepository.update(subtaskId, { status });
      }));
    }

    const updatedTask = await taskRepository.save(task);
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar task' });
  }
});

router.delete('/tasks/:taskId', async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const task = await taskRepository.findOne({
      where: { id: Like(taskId) },
      relations: ['subtasks', 'parentTask']
    });

    if (!task) {
      return res.status(404).json({ error: 'Task não encontrada' });
    }

    if (task.parentTask && task.parentTask.subtasks) {
      task.parentTask.subtasks = task.parentTask.subtasks.filter(t => t.id !== taskId);
      await taskRepository.save(task.parentTask);
    }

    if (task.subtasks && task.subtasks.length > 0) {
      for (const subtask of task.subtasks) {
        await taskRepository.remove(subtask);
      }
    }

    await taskRepository.remove(task);
    res.json({ message: 'Task excluída com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir task' });
  }
});

router.put('/tasks/:taskId/complete', async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const task = await taskRepository.findOne({
      where: { id: Like(taskId) },
      relations: ['subtasks']
    });

    if (!task) {
      return res.status(404).json({ error: 'Task não encontrada' });
    }

    task.status = true;
    await taskRepository.save(task);

    if (task.subtasks && task.subtasks.length > 0) {
      await Promise.all(task.subtasks.map(async subtask => {
        subtask.status = true;
        await taskRepository.save(subtask);
      }));
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao marcar task como concluída' });
  }
});

router.put('/tasks/:taskId/uncomplete', async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const task = await taskRepository.findOne({
      where: { id: Like(taskId) },
      relations: ['subtasks']
    });

    if (!task) {
      return res.status(404).json({ error: 'Task não encontrada' });
    }

    task.status = false;
    await taskRepository.save(task);

    if (task.subtasks && task.subtasks.length > 0) {
      await Promise.all(task.subtasks.map(async subtask => {
        subtask.status = false;
        await taskRepository.save(subtask);
      }));
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao desmarcar task como concluída' });
  }
});

router.get('/tasks/:status', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const status = req.params.status === 'completed';
    const tasks = await taskRepository.find({
      where: { userId, status },
      relations: ['subtasks']
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao filtrar tasks' });
  }
});

router.post('/tasks/:taskId/subtasks', async (req: Request, res: Response) => {
  try {
    const taskId = req.params.taskId;
    const { title, description } = req.body;

    const parentTask = await taskRepository.findOne({ where: { id: Like(taskId) } });
    if (!parentTask) {
      return res.status(404).json({ error: 'Task pai não encontrada' });
    }

    const subtask = taskRepository.create({
      title,
      description,
      status: false,
      userId: parentTask.userId,
      parentTask
    });

    const savedSubtask = await taskRepository.save(subtask);

    res.json(savedSubtask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar subtask' });
  }
});

export default router;
