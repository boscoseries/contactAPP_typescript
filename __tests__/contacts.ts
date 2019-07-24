import request from "supertest";
import app from "../src/app";
import { dropDB } from "../src/models/connection";

describe("API Routes", () => {
  afterAll(async () => await dropDB());

  const contact1Data = {
    surname: "John",
    firstname: "Doe",
    email: "jdoe@gmail.com",
    mobile: 2348056882349,
    phone: 2348089567322,
    address: "4 goodybag street, Lagos",
    website: "www.johndoe.com"
  };

  const contact2Data = {
    surname: "Seun",
    firstname: "Martins",
    email: "smartins@gmail.com",
    mobile: 2347056574873,
    phone: 2349045859002,
    address: "7 chevron drive, Lekki",
    website: "www.seunmartins.com"
  };

  const contact2 = async () => {
    return await request(app)
      .post("/api/contacts")
      .send(contact2Data);
  };

  test("POST /api/contacts should create a new contact", async () => {
    return await request(app)
      .post("/api/contacts")
      .send(contact1Data)
      .expect(res => {
        expect(res.status).toBe(201);
        expect(res.body.data).toEqual(
          expect.objectContaining({
            ...contact1Data,
            deleted: false,
            status: "available"
          })
        );
      });
  });

  test("GET /api/contacts should return an array of 'not-blocked or deleted' contact", async () => {
    return await request(app)
      .get("/api/contacts")
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("contacts");
      });
  });

  test("GET /api/contacts/id should return a contact with the given ID", async () => {
    const contact = await contact2();
    const id = contact.body.data._id;
    return await request(app)
      .get(`/api/contacts/${id}`)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("_id", id);
        expect(res.body.data).toHaveProperty("email", "smartins@gmail.com");
      });
  });

  test("PATCH /api/contacts/id/details should return an updated contact", async () => {
    const contact = await contact2();
    const id = contact.body.data._id;
    const details = {
      surname: "Okorowa",
      firstname: "Johnson",
      mobile: 2348012223333
    };
    return await request(app)
      .patch(`/api/contacts/${id}/details`)
      .send(details)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("mobile", details.mobile);
      });
  });

  test("PATCH /api/contacts/id/status should return contact with an updated status", async () => {
    const contact = await contact2();
    const id = contact.body.data._id;
    const details = {
      status: "blocked"
    };
    return await request(app)
      .patch(`/api/contacts/${id}/status`)
      .send(details)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("status", details.status);
      });
  });

  test("PATCH /api/contacts/id/delete should update contact's deleted status to true", async () => {
    const contact = await contact2();
    const id = contact.body.data._id;
    const details = {
      deleted: true
    };
    return await request(app)
      .patch(`/api/contacts/${id}/delete`)
      .send(details)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("deleted", details.deleted);
      });
  });

  test("DELETE /api/contacts/id should DELETE contact completely from database", async () => {
    const contact = await contact2();
    const id = contact.body.data._id;
    return await request(app)
      .delete(`/api/contacts/${id}`)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toContain(id);
      });
  });
});
