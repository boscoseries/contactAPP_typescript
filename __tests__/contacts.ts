import request from "supertest";
import app from "../src/app";
import { dropDB } from "../src/models/connection";

describe("Endpoints", () => {
  afterAll(async () => {
    await dropDB();
  });

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

  const invalidDetails = {
    surname: "Peter",
    firstname: "Pan",
    email: "ppan@gmail.com",
    mobile: 2347038907874,
    phone: 2349045844389,
    address: "3 remy martins drive, SA",
    website: "www.ppan.com",
    status: "blocked",
    deleted: true
  };

  const contact2 = async () => {
    return await request(app)
      .post("/api/contacts")
      .send(contact2Data);
  };

  const invalidUUID = "1234INVALID";
  const unavailableUUID = "4d373942b4031020a7d05ec8";

  // Tests for errors
  test("POST requests with 'status' and/or 'deleted' fields should throw", async () => {
    await request(app)
      .post("/api/contacts")
      .send(invalidDetails)
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain("is not allowed");
      });
  });

  test("GET requests to fetch blocked or deleted contacts should return 'No blocked contacts'", async () => {
    await request(app)
      .get("/api/contacts/blockedordeleted")
      .expect(res => {
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain("No blocked contacts");
      });
  });

  test("GET requests to an empty database should return 'no contact found'", async () => {
    await request(app)
      .get("/api/contacts")
      .expect(res => {
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain("No contacts found");
      });
  });

  test("GET requests with an invalid UUID should throw 500 error", async () => {
    await request(app)
      .get(`/api/contacts/${invalidUUID}`)
      .expect(res => {
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain(invalidUUID);
      });
  });

  test("GET requests with an valid UUID ID should return 'contact not found'", async () => {
    await request(app)
      .get(`/api/contacts/${unavailableUUID}`)
      .expect(res => {
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain("Contact not found");
      });
  });

  test("PATCH requests with an invalid UUID should throw 500 error", async () => {
    await request(app)
      .patch(`/api/contacts/${invalidUUID}/details`)
      .expect(res => {
        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain(invalidUUID);
      });
  });

  test("PATCH request with an valid UUID ID should return 'contact not found'", async () => {
    await request(app)
      .patch(`/api/contacts/${unavailableUUID}/details`)
      .expect(res => {
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain("Contact not found");
      });
  });

  // Tests for successes
  test("POST /api/contacts should create a new contact", async () => {
    return await request(app)
      .post("/api/contacts")
      .send(contact1Data)
      .expect(res => {
        expect(res.status).toBe(201);
        expect(res.body.contact).toEqual(
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
    const id = contact.body.contact._id;
    await request(app)
      .get(`/api/contacts/${id}`)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body.contact).toHaveProperty("_id", id);
        expect(res.body.contact).toHaveProperty("email", "smartins@gmail.com");
      });
  });

  test("PATCH /api/contacts/id/details should return an updated contact", async () => {
    const contact = await contact2();
    const id = contact.body.contact._id;
    const details = {
      surname: "Okorowa",
      firstname: "Johnson",
      mobile: 2348012223333
    };
    await request(app)
      .patch(`/api/contacts/${id}/details`)
      .send(details)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("contact");
        expect(res.body.contact).toHaveProperty("mobile", details.mobile);
      });
  });

  test("PATCH /api/contacts/id/status should return contact with an updated status", async () => {
    const contact = await contact2();
    const id = contact.body.contact._id;
    const details = {
      status: "blocked"
    };
    await request(app)
      .patch(`/api/contacts/${id}/status`)
      .send(details)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("contact");
        expect(res.body.contact).toHaveProperty("status", details.status);
      });
  });

  test("GET /api/contacts/blockedordeleted should return 1 blocked contact", async () => {
    await request(app)
      .get("/api/contacts/blockedordeleted")
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("contacts");
        expect(res.body.contacts).toHaveLength(1);
        expect(res.body.contacts[0]).toHaveProperty("status", "blocked");
      });
  });

  test("GET /api/contacts should return an array of 'not-blocked or deleted' contact", async () => {
    return await request(app)
      .get("/api/contacts")
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("contacts");
        expect(res.body.contacts).toHaveLength(3);
        expect(res.body.contacts[0]).toHaveProperty("status", "available");
      });
  });

  test("PATCH /api/contacts/id/delete should update contact's deleted status to true", async () => {
    const contact = await contact2();
    const id = contact.body.contact._id;
    const details = {
      deleted: true
    };
    await request(app)
      .patch(`/api/contacts/${id}/delete`)
      .send(details)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("contact");
        expect(res.body.contact).toHaveProperty("deleted", details.deleted);
      });
  });

  test("DELETE /api/contacts/id should DELETE contact completely from database", async () => {
    const contact = await contact2();
    const id = contact.body.contact._id;
    await request(app)
      .delete(`/api/contacts/${id}`)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toContain(id);
      });
  });
});
