import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

import { createConnection } from "typeorm";

export class App {
  app: Application;

  constructor(private port?: number | string) {
    this.app = express();
    createConnection();
    this.settings();
    this.middlewares();
    this.routes();
  }

  private settings() {
    this.app.set("port", this.port || process.env.PORT || 3000);
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(morgan("dev"));
    this.app.use(express.json());
  }

  private routes() {
    this.app.use("/user", userRoutes);
    this.app.use("/auth", authRoutes);
  }

  async listen(): Promise<void> {
    await this.app.listen(this.app.get("port"));
    console.log("Server on port", this.app.get("port"));
  }
}

async function main() {
  const app = new App(3000);
  await app.listen();
}

main();
