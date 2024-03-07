"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../auth");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.use(auth_1.authenticate);
// Criar uma nova task
router.post('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        const userId = req.body.userId;
        const task = yield prisma.task.create({
            data: {
                title,
                description,
                status: false,
                userId
            }
        });
        res.json(task);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar task' });
    }
}));
// Listar todas as tasks do usuário
router.get('/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const tasks = yield prisma.task.findMany({
            where: {
                userId
            }
        });
        res.json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar tasks' });
    }
}));
// Editar uma task específica
router.put('/tasks/:taskId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = parseInt(req.params.taskId);
        const { title, description, status } = req.body;
        const updatedTask = yield prisma.task.update({
            where: { id: taskId },
            data: {
                title,
                description,
                status
            }
        });
        res.json(updatedTask);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar task' });
    }
}));
// Deletar uma task específica
router.delete('/tasks/:taskId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = parseInt(req.params.taskId);
        yield prisma.task.delete({
            where: { id: taskId }
        });
        res.json({ message: 'Task excluída com sucesso' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir task' });
    }
}));
// Marcar uma task como concluída
router.put('/tasks/:taskId/complete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = parseInt(req.params.taskId);
        const updatedTask = yield prisma.task.update({
            where: { id: taskId },
            data: {
                status: true
            }
        });
        res.json(updatedTask);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao marcar task como concluída' });
    }
}));
// Desmarcar uma task como concluída
router.put('/tasks/:taskId/uncomplete', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskId = parseInt(req.params.taskId);
        const updatedTask = yield prisma.task.update({
            where: { id: taskId },
            data: {
                status: false
            }
        });
        res.json(updatedTask);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao desmarcar task como concluída' });
    }
}));
// Filtrar tasks pelo status
router.get('/tasks/:status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const status = req.params.status === 'completed';
        const tasks = yield prisma.task.findMany({
            where: {
                userId,
                status
            }
        });
        res.json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao filtrar tasks' });
    }
}));
exports.default = router;
