import express, { Request, Response } from "express";
import { setupApp } from "./config";

const app = express();
setupApp(app);

// Route handler explicitly typed
app.get("/", (_req: Request, res: Response): void => {
  res.send("Workout Progress Tracker API");
});

export default app;
