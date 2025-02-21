const request = require("supertest");
const express = require("express");
const router = require("../../service-layer/routes/memberRoute.js"); // Adjust the path

// Mock business logic and middleware
jest.mock("../../business-logic-layer/public/exports.js", () => {
  return jest.fn().mockImplementation(() => ({
    getMember: jest.fn(),
    updateMember: jest.fn(),
    createMember: jest.fn(),
    getSpecificMemberOrgStats: jest.fn(),
  }));
});

jest.mock("../../service-layer/sessionMiddleware.js", () => ({
  isAuthorizedHasSessionForAPI: (req, res, next) => next(),
}));

// Setup Express app
const app = express();
app.use(express.json());
app.use("/v1/member", router);

describe("Member API Routes", () => {
  describe("GET /v1/member/:memberId", () => {
    it("should return 400 if memberId is missing", async () => {
      const res = await request(app).get("/v1/member/");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 if memberId is invalid", async () => {
      const res = await request(app).get("/v1/member/invalid");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 404 if member is not found", async () => {
      const { getMember } = require("../../business-logic-layer/public/exports.js").mock.instances[0];
      getMember.mockResolvedValue({ error: "member_not_found" });

      const res = await request(app).get("/v1/member/123");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 200 with member data", async () => {
      const { getMember } = require("../../business-logic-layer/public/exports.js").mock.instances[0];
      getMember.mockResolvedValue({ data: { id: 123, name: "John Doe" }, error: null });

      const res = await request(app).get("/v1/member/123");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toEqual({ id: 123, name: "John Doe" });
    });
  });

  describe("PUT /v1/member/:memberId", () => {
    it("should return 400 if memberId is invalid", async () => {
      const res = await request(app).put("/v1/member/invalid").send({ phone_number: "1234567890" });
      expect(res.status).toBe(400);
    });

    it("should return 400 if no valid fields are provided", async () => {
      const res = await request(app).put("/v1/member/123").send({});
      expect(res.status).toBe(400);
    });

    it("should return 404 if member is not found", async () => {
      const { updateMember } = require("../../business-logic-layer/public/exports.js").mock.instances[0];
      updateMember.mockResolvedValue({ error: "member_not_found" });

      const res = await request(app).put("/v1/member/123").send({ phone_number: "1234567890" });
      expect(res.status).toBe(404);
    });

    it("should return 200 with updated data", async () => {
      const { updateMember } = require("../../business-logic-layer/public/exports.js").mock.instances[0];
      updateMember.mockResolvedValue({ data: { id: 123, phone_number: "1234567890" }, error: null });

      const res = await request(app).put("/v1/member/123").send({ phone_number: "1234567890" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });
  });

  describe("POST /v1/member", () => {
    it("should return 400 if required fields are missing", async () => {
      const res = await request(app).post("/v1/member").send({});
      expect(res.status).toBe(400);
    });

    it("should return 200 with created member data", async () => {
      const { createMember } = require("../../business-logic-layer/public/exports.js").mock.instances[0];
      createMember.mockResolvedValue({ data: { id: 1, name: "John Doe" }, error: null });

      const res = await request(app)
        .post("/v1/member")
        .send({
          name: "John Doe",
          email: "john@example.com",
          personal_email: "john.personal@example.com",
          phone_number: "1234567890",
          graduation_date: "2025",
          tshirt_size: "M",
          major: "CS",
          gender: "Male",
          race: "White",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.name).toBe("John Doe");
    });
  });

  describe("GET /v1/member/:memberId/stats", () => {
    it("should return 400 if orgId is missing", async () => {
      const res = await request(app).get("/v1/member/123/stats");
      expect(res.status).toBe(400);
    });

    it("should return 400 if orgId is invalid", async () => {
      const res = await request(app).get("/v1/member/123/stats?orgId=invalid");
      expect(res.status).toBe(400);
    });

    it("should return 404 if member stats are not found", async () => {
      const { getSpecificMemberOrgStats } = require("../../business-logic-layer/public/exports.js").mock.instances[0];
      getSpecificMemberOrgStats.mockResolvedValue({ error: "stats_not_found" });

      const res = await request(app).get("/v1/member/123/stats?orgId=456");
      expect(res.status).toBe(404);
    });

    it("should return 200 with member stats", async () => {
      const { getSpecificMemberOrgStats } = require("../../business-logic-layer/public/exports.js").mock.instances[0];
      getSpecificMemberOrgStats.mockResolvedValue({ activities: 5, events: 3 });

      const res = await request(app).get("/v1/member/123/stats?orgId=456");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });
  });
});
