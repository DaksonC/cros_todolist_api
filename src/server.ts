import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import todoRoutes from './routes/todoRoutes';

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/todo', todoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

