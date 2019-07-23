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

const dropDB = async () => {
  await mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
};

describe("API Routes", () => {

  beforeAll( async () => await createDB());
  afterAll( async () => await dropDB());

  const data1 = {
    surname: "John",
    firstname: "Doe",
    email: "jdoe@gmail.com",
    mobile: 2348056882349,
    phone: 2348089567322,
    address: "4 goodybag street, Lagos",
    website: "www.johndoe.com"
  };

 const data2 = {
      surname: "Seun",
      firstname: "Martins",
      email: "smartins@gmail.com",
      mobile: 2347056574873,
      phone: 2349045859002,
      address: "7 chevron drive, Lekki",
      website: "www.seunmartins.com"
 };

  const contact2 = async () => {
     return await request(app).post("/api/contacts").send(data2);
 }

  test("POST /api/contacts should create a new contact", async (done) => {
    return await request(app)
      .post("/api/contacts")
      .send(data1)
      .expect(res => {
        expect(res.status).toBe(201);
        expect(res.body.data).toEqual(
          expect.objectContaining({
            ...data1,
            deleted: false,
            status: "available"
          })
        );
        done();
      });
  });

  test("GET /api/contacts should return an array of 'not-blocked or deleted' contact", async (done) => {
    return await request(app)
      .get("/api/contacts")
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("contacts");
        done()
      });
  });

  test("GET /api/contacts/id should return a contact with the given ID", async (done) => {
    const contact = await contact2();
    const id = contact.body.data._id;
      await request(app)
      .get(`/api/contacts/${id}`)
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body.data).toHaveProperty("_id", id);
        expect(res.body.data).toHaveProperty("email", "smartins@gmail.com");
      });
    done();
  });

  test("PATCH /api/contacts/id/details should return an updated contact", async (done) => {
    const contact = await contact2();
    const id = contact.body.data._id;
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
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("mobile", details.mobile);
      });
    done()
  });








});




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
