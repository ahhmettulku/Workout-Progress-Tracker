import request from "supertest";
import app from "../app";

describe("WorkoutController Integration", () => {
  let workoutId: number;

  it("should create a new workout", async () => {
    const res = await request(app)
      .post("/api/workouts")
      .send({
        date: new Date().toISOString(),
        exercises: [{ name: "Bench Press", sets: 3, reps: 10, weight: 80 }],
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    workoutId = res.body.id;
  });

  it("should get all workouts (with take param)", async () => {
    const res = await request(app).get("/api/workouts?take=1000");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((w: any) => w.id === workoutId)).toBe(true);
  });

  it("should get all workouts with search param (search='')", async () => {
    const res = await request(app).get("/api/workouts?search=&take=1000");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((w: any) => w.id === workoutId)).toBe(true);
  });

  it("should get a workout by id", async () => {
    const res = await request(app).get(`/api/workouts/${workoutId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", workoutId);
  });

  it("should update a workout", async () => {
    const res = await request(app)
      .put(`/api/workouts/${workoutId}`)
      .send({
        date: new Date().toISOString(),
        exercises: [{ name: "Row", sets: 4, reps: 10, weight: 30 }],
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.exercises[0].name).toBe("Row");
  });

  it("should delete a workout", async () => {
    const res = await request(app).delete(`/api/workouts/${workoutId}`);
    expect([200, 204]).toContain(res.statusCode);
  });

  it("should return 404 for non-existent workout", async () => {
    const res = await request(app).get(`/api/workouts/99999999`);
    expect(res.statusCode).toBe(404);
  });
});
