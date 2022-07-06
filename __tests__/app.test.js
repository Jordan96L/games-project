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
            expect(body.review.review_id).toBe(5);
            expect(body.review.designer).toBe("Seymour Buttz");
            expect(body.review.owner).toBe("mallionaire");
            expect(body.review.votes).toBe(5);
          });
      });
      test("200: should respond with a single matching review and comment_count column", () => {
        const review_id = 5;
        return request(app)
          .get(`/api/reviews/${review_id}`)
          .expect(200)
          .then(({ body }) => {
            expect(body.review).toHaveProperty("comment_count");
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
  describe("PATCH /api/reviews/:review_id", () => {
    const goodPatchExample = { inc_votes: 5 };
    const badPatchExample = { inc_votes: "not_a_num" };
    const badPatchExample2 = { iaddVotes: 5 };

    describe("Happy paths", () => {
      test("200: should update the expected review if path and request body are valid", () => {
        return request(app)
          .patch("/api/reviews/5")
          .send(goodPatchExample)
          .expect(200)
          .then(({ body: { review } }) => {
            expect(review).toEqual({
              review_id: 5,
              title: "Proident tempor et.",
              designer: "Seymour Buttz",
              owner: "mallionaire",
              review_img_url:
                "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
              review_body:
                "Labore occaecat sunt qui commodo anim anim aliqua adipisicing aliquip fugiat. Ad in ipsum incididunt esse amet deserunt aliqua exercitation occaecat nostrud irure labore ipsum. Culpa tempor non voluptate reprehenderit deserunt pariatur cupidatat aliqua adipisicing. Nostrud labore dolor fugiat sint consequat excepteur dolore irure eu. Anim ex adipisicing magna deserunt enim fugiat do nulla officia sint. Ex tempor ut aliquip exercitation eiusmod. Excepteur deserunt officia voluptate sunt aliqua esse deserunt velit. In id non proident veniam ipsum id in consequat duis ipsum et incididunt. Qui cupidatat ea deserunt magna proident nisi nulla eiusmod aliquip magna deserunt fugiat fugiat incididunt. Laboris nisi velit mollit ullamco deserunt eiusmod deserunt ea dolore veniam.",
              category: "social deduction",
              created_at: "2021-01-07T09:06:08.077Z",
              votes: 10,
            });
          });
      });
    });
    describe("error handling", () => {
      test("404: should return 404 when passed non-existent id", () => {
        return request(app)
          .patch("/api/reviews/999")
          .send(goodPatchExample)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("review id does not exist");
          });
      });
      test("400: should return 400 when passed invalid input", () => {
        return request(app)
          .patch("/api/reviews/notAnId")
          .send(goodPatchExample)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("review_id must be a number");
          });
      });
      test("400: should return 400 when passed invalid patch body", () => {
        return request(app)
          .patch("/api/reviews/5")
          .send(badPatchExample)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("The information provided is not correct");
          });
      });
      test("400: should return 400 when passed invalid patch body with wrong prop name", () => {
        return request(app)
          .patch("/api/reviews/5")
          .send(badPatchExample2)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("The information provided is not correct");
          });
      });
    });
  });
  describe("GET /api/users", () => {
    test("200: should respond with all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users).toHaveLength(4);
          body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("GET /api/reviews", () => {
    test("200: should respond with all the reviews", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toHaveLength(13);
          body.reviews.forEach((review) => {
            expect(review).toMatchObject({
              review_id: expect.any(Number),
              title: expect.any(String),
              category: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_body: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            });
          });
        });
    });
    test("200: reviews should be ordered by created_at", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("GET /api/reviews/:review_id/comments", () => {
    describe("happy paths", () => {
      test("200: should respond with comments from the given review_id", () => {
        return request(app)
          .get("/api/reviews/3/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toHaveLength(3);
            body.comments.forEach((comment) => {
              expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                body: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                review_id: expect.any(Number),
                created_at: expect.any(String),
              });
            });
          });
      });
      test("200: should respond with 200 and empty array if review id is valid but no comments from this id", () => {
        return request(app)
          .get("/api/reviews/5/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toHaveLength(0);
            expect(body.comments).toEqual([]);
          });
      });
    });
    describe("error handling", () => {
      test("404: should respond with 404 status when passed invalid review id", () => {
        return request(app)
          .get("/api/reviews/999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("review id does not exist");
          });
      });
      test("400: should respond with 400 status when passed ivalid input", () => {
        return request(app)
          .get("/api/reviews/notAnId/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("review_id must be a number");
          });
      });
    });
  });
});
