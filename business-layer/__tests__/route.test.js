const request = require("supertest");
const express = require("express");
const testRoute = require("../service-layer/routes/testRoute");

describe("GET /test", () => {
  it("should return a 200 status and a JSON message", async () => {
    const app = express();
    app.use("/", testRoute);

    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Hello Tester" });
  });
});
