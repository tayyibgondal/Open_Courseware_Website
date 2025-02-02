const request = require("supertest");
const app = require("../../index");
const CareerPath = require("../../models/CareerPath");

describe("Integration Tests: Career Paths Endpoints", () => {
  let careerPathId;

  // Test GET /careerpaths endpoint
  describe("GET /careerpaths", () => {
    it("should return status code 200 and an array of career paths", async () => {
      const response = await request(app).get("/careerpaths");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Test POST /careerpaths/create endpoint
  describe("POST /careerpaths/create", () => {
    it("should create a new career path and return status code 200", async () => {
      // Mock data for the new career path
      const newCareerPathData = {
        title: "Test Career Path Integration",
        description: "Test Career Path Description",
      };

      // Send a POST request to create a new career path
      const response = await request(app)
        .post("/careerpaths/create")
        .send(newCareerPathData);

      // Store the created career path's ID for later use in other tests
      careerPathId = response.body.careerPath._id;

      // Check the status code and response body
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("CareerPath added!");

      // Check if the new career path is correctly created in the database
      const createdCareerPath = await CareerPath.findOne({
        _id: careerPathId,
      });
      expect(createdCareerPath).toBeTruthy();
      expect(createdCareerPath.title).toBe(newCareerPathData.title);
      expect(createdCareerPath.description).toBe(newCareerPathData.description);
    });

    it("should return status code 500 if an error occurs", async () => {
      // Mock data with missing required fields to trigger an error
      const invalidCareerPathData = {};

      // Send a POST request with invalid data
      const response = await request(app).post("/careerpaths/create");

      // Check if the response has status code 500
      expect(response.status).toBe(500);
    });
  });

  // Test PUT /careerpaths/edit/:careerPathId endpoint
  describe("PUT /careerpaths/edit/:careerPathId", () => {
    it("should update a career path and return status code 200", async () => {
      const updatedCareerPathData = {
        title: "Updated Career Path Title HEHE",
        description: "Updated Career Path Description",
      };

      // Send a PUT request to update the career path
      const response = await request(app)
        .put(`/careerpaths/edit/${careerPathId}`)
        .send(updatedCareerPathData);

      // Check the status code and response body
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("CareerPath updated!");

      // Check if the career path is correctly updated in the database
      const updatedCareerPath = await CareerPath.findById(careerPathId);
      expect(updatedCareerPath.title).toBe(updatedCareerPathData.title);
      expect(updatedCareerPath.description).toBe(
        updatedCareerPathData.description
      );
    });

    it("should return status code 500 if an error occurs", async () => {
      // Send a PUT request with invalid data to trigger an error
      const response = await request(app).put(`/careerpaths/edit/123`);

      // Check if the response has status code 500
      expect(response.status).toBe(500);
    });
  });

  // Test GET /careerpaths/search/:query endpoint
  describe("GET /careerpaths/search/:query", () => {
    it("should return status code 200 and search results if query matches", async () => {
      // Define the search query
      const query = "HEHE";

      // Send a GET request to search for the career path
      const response = await request(app).get(`/careerpaths/search/${query}`);

      // Check the status code and response body
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0); // Ensure search results are returned
    });

    it("should return status code 404 if no results found", async () => {
      // Define a query that won't match any career path
      const query = "XAOIKSAJJAOSUIHRKSAN";

      // Send a GET request to search for a nonexistent career path
      const response = await request(app).get(`/careerpaths/search/${query}`);

      // Check the status code and response body
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("No results found");
    });
  });

  // Test DELETE /careerpaths/delete/:careerPathId endpoint
  describe("DELETE /careerpaths/delete/:careerPathId", () => {
    it("should delete a career path and return status code 200", async () => {
      // Send a DELETE request to delete the career path
      const response = await request(app).delete(
        `/careerpaths/delete/${careerPathId}`
      );

      // Check the status code and response body
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("CareerPath deleted!");

      // Check if the career path is deleted from the database
      const deletedCareerPath = await CareerPath.findById(careerPathId);
      expect(deletedCareerPath).toBeNull();
    });

    it("should return status code 500 if career path not found", async () => {
      // Send a DELETE request with an invalid ID to trigger a 500 response
      const response = await request(app).delete(
        `/careerpaths/delete/invalidId`
      );

      // Check if the response has status code 500
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal Server Error!");
    });
  });
});
