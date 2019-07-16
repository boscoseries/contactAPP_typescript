import request from "supertest";
import app from "../src/app";

describe("API Routes", () => {
  const contact = {
    surname: "John",
    firstname: "Doe",
    email: "jdoe@gmail.com",
    mobile: "08056882349",
    phone: "08089567322",
    address: "4 goodybag street, Lagos",
    website: "www.johndoe.com",
    status: "available"
  };
  test("POST /api/contacts should create a new contact", () => {
    return request(app)
      .post("/api/contacts")
      .send(contact)
      .expect(res => {
        expect(res.status).toBe(201);
        expect(res.body.data).toEqual(expect.objectContaining(contact));
      });
  });
  test("GET /api/contacts should return an array of 'not-blocked' contact", () => {
    return request(app)
      .get("/api/contacts")
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toEqual(
          expect.arrayContaining([
            {
              address: "6 sterling street, NY",
              email: "harryp@gmail.com",
              firstname: "Harry",
              id: 1,
              mobile: "07048394755",
              phone: "08089567322",
              status: "available",
              surname: "Porter",
              website: "www.harryporter.com"
            }
          ])
        );
      });
  });
});

test("GET /api/contacts/id should return a contact with the given ID", () => {
  const id = 1
  return request(app)
    .get(`/api/contacts/${id}`)
    .expect(res => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id', id);
    });
});

test("PATCH /api/contacts/id/details should return an updated contact", () => {
  const id = 1
  const details = {
    surname: "Okorowa",
    firstname: "Johnson",
    mobile: "08012223333"
  }
  return request(app)
    .patch(`/api/contacts/${id}/details`)
    .send(details)
    .expect(res => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('mobile', details.mobile);
    })


});
