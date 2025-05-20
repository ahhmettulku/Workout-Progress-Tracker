import "reflect-metadata";
import { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import {
  useContainer,
  useExpressServer,
  getMetadataArgsStorage,
} from "routing-controllers";
import { Container } from "typedi";
import { WorkoutController } from "./controllers/WorkoutController";
import swaggerUi from "swagger-ui-express";
import { routingControllersToSpec } from "routing-controllers-openapi";

dotenv.config();

export function setupApp(app: Application): void {
  app.use(helmet());
  app.use(morgan("common"));
  app.use(cors());

  useContainer(Container);

  const routingControllerOptions = {
    validation: true,
    controllers: [WorkoutController],
    cors: true,
  };

  useExpressServer(app, routingControllerOptions);

  // Now, after useExpressServer!
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(
    storage,
    {},
    {
      components: {},
      info: {
        title: "Workout Tracker API",
        version: "1.0.0",
      },
    },
  );
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
}
