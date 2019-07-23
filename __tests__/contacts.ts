import request from "supertest";
import app from "../src/app";
const mongoose = require("mongoose");
import dotenv from "dotenv";
dotenv.config();

const createDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_TEST, { useNewUrlParser: true });
    console.log(`connected to ${process.env.MONGODB_TEST}`);
  } catch (err) {
    console.error(err);
  }
};

const dropDB = () => {
  mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
};

describe("API Routes", () => {
  beforeAll(async () => await createDB());
  afterAll(() => dropDB());

  const contact1 = {
    surname: "John",
    firstname: "Doe",
    email: "jdoe@gmail.com",
    mobile: 2348056882349,
    phone: 2348089567322,
    address: "4 goodybag street, Lagos",
    website: "www.johndoe.com"
  };

  const contact2 = {
    surname: "Seun",
    firstname: "Martins",
    email: "smartins@gmail.com",
    mobile: 2347056574873,
    phone: 2349045859002,
    address: "7 chevron drive, Lekki",
    website: "www.seunmartins.com"
  };

  test("create contact with id 2", () => {
    return request(app)
      .post("/api/contacts")
      .send(contact2);
  });

  test("POST /api/contacts should create a new contact", async () => {
    return await request(app)
      .post("/api/contacts")
      .send(contact1)
      .expect(res => {
        expect(res.status).toBe(201);
        expect(res.body.data).toEqual(
          expect.objectContaining({
            ...contact1,
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
});

// test("GET /api/contacts/id should return a contact with the given ID", async () => {
//   const id = contact1.id;
//     await request(app)
//     .get(`/api/contacts/${id}`)
//     .expect(res => {
//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty("contact");
//       expect(res.body.contact).toHaveProperty("id", id);
//     });
// });

// test("PATCH /api/contacts/id/details should return an updated contact", async () => {
//   const id = 1;
//   const details = {
//     surname: "Okorowa",
//     firstname: "Johnson",
//     mobile: "08012223333"
//   };
//     await request(app)
//     .patch(`/api/contacts/${id}/details`)
//     .send(details)
//     .expect(res => {
//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty("data");
//       expect(res.body.data).toHaveProperty("mobile", details.mobile);
//     });
// });

// test("PATCH /api/contacts/id/status should return contact with an updated status", async () => {
//   const id = 1;
//   const details = {
//     status: "blocked"
//   };
//     await request(app)
//     .patch(`/api/contacts/${id}/status`)
//     .send(details)
//     .expect(res => {
//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty("data");
//       expect(res.body.data).toHaveProperty("status", details.status);
//     });
// });
// test("PATCH /api/contacts/id/delete should update contact's deleted status to true", async () => {
//   const id = 1;
//   const details = {
//     deleted: true
//   };
//     await request(app)
//     .patch(`/api/contacts/${id}/delete`)
//     .send(details)
//     .expect(res => {
//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty("data");
//       expect(res.body.data).toHaveProperty("deleted", details.deleted);
//     });
// });
// test("DELETE /api/contacts/id should DELETE contact completely from database", async () => {
//   const id = 4;
//     await request(app)
//     .delete(`/api/contacts/${id}`)
//     .expect(res => {
//       expect(res.status).toBe(200);
//       expect(res.body).toHaveProperty("message");
//       expect(res.body.message).toEqual(`contact ${id} deleted from database`);
//     });
