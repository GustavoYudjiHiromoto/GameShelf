import { DatabaseSync } from "node:sqlite";

const database = new DatabaseSync("prisma/dev.db");
database.close();
