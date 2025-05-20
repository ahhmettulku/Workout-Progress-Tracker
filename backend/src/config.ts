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
  // Add security headers
  app.use(helmet());
  // Log HTTP requests
  app.use(morgan("common"));
  // Enable CORS for all routes
  app.use(cors());

  // Tell routing-controllers to use typedi for dependency injection
  useContainer(Container);

  // Options for routing-controllers (controllers, validation, CORS)
  const routingControllerOptions = {
    validation: true,
    controllers: [WorkoutController],
    cors: true,
  };

  // Register routing-controllers middleware and routes
  useExpressServer(app, routingControllerOptions);

  // --- Swagger/OpenAPI setup ---
  // Get metadata from routing-controllers decorators
  const storage = getMetadataArgsStorage();
  // Generate OpenAPI spec from routing-controllers metadata
  const spec = routingControllersToSpec(
    storage,
    {}, // You can pass routingControllerOptions here if needed
    {
      components: {},
      info: {
        title: "Workout Tracker API",
        version: "1.0.0",
      },
    },
  );
  // Serve Swagger UI at /docs
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
}
