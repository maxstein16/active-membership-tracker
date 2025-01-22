const { getTestRoute } = require("../service-layer/routes/testRoute");

describe("GET /test", () => {
  it("should return a 200 status and a JSON message", () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    getTestRoute(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Hello Tester" });
  });
});
