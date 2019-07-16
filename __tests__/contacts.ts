import request from "supertest";
import app from "../src/app";

describe("API Routes", () => {
  const contact1 = {
    surname: "John",
    firstname: "Doe",
    email: "jdoe@gmail.com",
    mobile: "08056882349",
    phone: "08089567322",
    address: "4 goodybag street, Lagos",
    website: "www.johndoe.com",
    status: "available",
    deleted: false
  };

  const contact2 = {
    surname: "Seun",
    firstname: "Martins",
    email: "smartins@gmail.com",
    mobile: "07056574873",
    phone: "09045859002",
    address: "7 chevron drive, Lekki",
    website: "www.seunmartins.com",
    status: "available",
    deleted: false
  };

  test("create contact with id 2", () => {
    return request(app)
      .post("/api/contacts")
      .send(contact2)
      });
  test("POST /api/contacts should create a new contact", () => {
    return request(app)
      .post("/api/contacts")
      .send(contact1)
      .expect(res => {
        expect(res.status).toBe(201);
        expect(res.body.data).toEqual(expect.objectContaining(contact1));
      });
  });
  test("GET /api/contacts should return an array of 'not-blocked or deleted' contact", () => {
    return request(app)
      .get("/api/contacts")
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toEqual(
          expect.arrayContaining([
            {
              address: "6 sterling street, NY",
              deleted: false,
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
  const id = 1;
  return request(app)
    .get(`/api/contacts/${id}`)
    .expect(res => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("id", id);
    });
});

test("PATCH /api/contacts/id/details should return an updated contact", () => {
  const id = 1;
  const details = {
    surname: "Okorowa",
    firstname: "Johnson",
    mobile: "08012223333"
  };
  return request(app)
    .patch(`/api/contacts/${id}/details`)
    .send(details)
    .expect(res => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("mobile", details.mobile);
    });
});

test("PATCH /api/contacts/id/status should return contact with an updated status", () => {
  const id = 1;
  const details = {
    status: "blocked"
  };
  return request(app)
    .patch(`/api/contacts/${id}/status`)
    .send(details)
    .expect(res => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("status", details.status);
    });
});
test("PATCH /api/contacts/id/delete should update contact's deleted status to true", () => {
  const id = 1;
  const details = {
    deleted: true
  };
  return request(app)
    .patch(`/api/contacts/${id}/delete`)
    .send(details)
    .expect(res => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("deleted", details.deleted);
    });
});
test("DELETE /api/contacts/id should DELETE contact completely from database", () => {
  const id = 4;
  return request(app)
    .delete(`/api/contacts/${id}`)
    .expect(res => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual(`contact ${id} deleted from database`);
    });
});
