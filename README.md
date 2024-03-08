# API REST TodoList

Esta é uma API RESTful TodoList criada com Node.js, TypeScript, Express, SQLite, Prisma e autenticação JWT.

## Instalação

Antes de começar, certifique-se de ter o Node.js e o npm (ou Yarn) instalados em sua máquina.

1. Clone este repositório:

```bash
git clone https://github.com/DaksonC/cros_todolist_api.git
```
## Navegue até o diretório do projeto:
```bash
cd cros_todolist_api
```
Instale as dependências usando npm ou Yarn:
Com npm:
```bash
npm install
```
Com Yarn:
```bash
yarn install
```
Execute as migrações do banco de dados:
```bash
npx prisma migrate dev --name init
```
Executando o servidor de desenvolvimento
Para iniciar o servidor de desenvolvimento, você pode usar npm ou Yarn.

Com npm:
```bash
npm run start:dev
```
Com Yarn:
```bash
yarn start:dev
```
Com Docker
```bash
docker-compose  up --build
```
O servidor será iniciado e estará acessível em http://localhost:3000.
