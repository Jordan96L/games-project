const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("my express app", () => {
  describe("GET /api/categories", () => {
    test("200: should respond with all categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(body.categories).toHaveLength(4);
          body.categories.forEach((category) => {
            expect(category).toHaveProperty("slug");
            expect(category).toHaveProperty("description");
          });
        });
    });
  });
  describe("GET /api/reviews/:review_id", () => {
    describe("happy paths", () => {
      test("200: should respond with a single matching review", () => {
        const review_id = 5;
        return request(app)
          .get(`/api/reviews/${review_id}`)
          .expect(200)
          .then(({ body }) => {
            expect(body.review.title).toBe("Proident tempor et.");
          });
      });
    });
    describe("error handling", () => {
      test("404: should return 404 when passed a invalid review id", () => {
        const id = 1000;
        return request(app)
          .get(`/api/reviews/${id}`)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("review id does not exist");
          });
      });
      test("400: should return 400 when passed invalid input", () => {
        return request(app)
          .get("/api/reviews/notAnId")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("review_id must be a number");
          });
      });
    });
  });
});
