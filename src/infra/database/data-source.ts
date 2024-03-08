import { DataSource } from "typeorm";
import { User } from "../../entitys/user";
import { Task } from "../../entitys/task";

require("dotenv").config()

export const AppDataSource = new DataSource({
  type: "mssql",
  host: "movie-reviewsv1.database.windows.net",
  port: 1433,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "todo-list-db",
  synchronize: true,
  logging: true,
  entities: [User, Task],
  subscribers: [],
  migrations: [],
})

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })

