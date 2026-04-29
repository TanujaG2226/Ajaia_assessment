const request = require("supertest");
const app = require("../server"); // we’ll tweak server in a sec

describe("Document API", () => {
  it("should create a document", async () => {
    const res = await request(app).post("/documents").send({
      title: "Test Doc",
      content: "Hello",
      ownerId: 1,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Doc");
  });
});