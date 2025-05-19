import request from "supertest";
import app from "../app";

describe("E2E: Workout Flow", () => {
  it("should create, fetch, update, and delete a workout", async () => {
    // Create
    const createRes = await request(app)
      .post("/api/workouts")
      .send({
        date: new Date().toISOString(),
        exercises: [{ name: "Pull Up", sets: 3, reps: 8, weight: 0 }],
      });
    expect(createRes.statusCode).toBe(201);

    const workoutId = createRes.body.id;

    // Get with search="" parameter (should return the created workout)
    const searchRes = await request(app).get("/api/workouts?search=&take=1000");
    expect(searchRes.statusCode).toBe(200);
    expect(Array.isArray(searchRes.body)).toBe(true);
    // Check that the created workout is in the result set
    expect(searchRes.body.some((w: any) => w.id === workoutId)).toBe(true);

    // Fetch
    const fetchRes = await request(app).get(`/api/workouts/${workoutId}`);
    expect(fetchRes.statusCode).toBe(200);

    // Update
    const updateRes = await request(app)
      .put(`/api/workouts/${workoutId}`)
      .send({
        date: new Date().toISOString(),
        exercises: [{ name: "Row", sets: 4, reps: 10, weight: 30 }],
      });
    expect(updateRes.statusCode).toBe(200);

    // Delete
    const deleteRes = await request(app).delete(`/api/workouts/${workoutId}`);
    expect([200, 204]).toContain(deleteRes.statusCode);
  });
});
