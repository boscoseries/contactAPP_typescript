import { Router } from "express";
import {
  addContact,
  getAll,
  getOne,
  update,
  getBlocked,
  deleteOne
} from "../controllers/contacts";

const router = Router();

/* CREATE contact. */
router.post("/", addContact);
/* GET all contacts. */
router.get("/", getAll);
/* GET blocked contacts. */
router.get("/blockedordeleted", getBlocked);
/* GET a single contact. */
router.get("/:id", getOne);
/* UPDATE status of a single contact. */
router.patch("/:id/status", update);
/* UPDATE details of a single contact. */
router.patch("/:id/details", update);
/* Set DELETED status of a single contact. */
router.patch("/:id/delete", update);
/* HARD DELETE a contact. */
router.delete("/:id/", deleteOne);

export default router;
