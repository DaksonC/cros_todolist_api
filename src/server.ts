import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/authRoutes';
import todoRoutes from './routes/todoRoutes';
import swaggerDocument from './docs/swagger.json';
import { AppDataSource } from './infra/database/data-source';

const startApp = async () => {
  await AppDataSource.initialize();

  const app = express();
  app.use(bodyParser.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/auth', authRoutes);
  app.use('/todo', todoRoutes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startApp();



