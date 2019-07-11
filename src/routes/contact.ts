import { Router } from "express";
import {
  create,
  getAll,
  getOne,
  update,
  deleteOne,
  getBlocked
} from "../controllers/contact";

const router = Router();

/* CREATE contact. */
router.post("/", create);
/* GET all contacts. */
router.get("/", getAll);
/* GET blocked contacts. */
router.get("/blocked", getBlocked);
/* GET a single contact. */
router.get("/:id", getOne);
/* UPDATE status of a single contact. */
router.patch("/:id/status", update);
/* UPDATE details of a single contact. */
router.patch("/:id/details", update);
/* DELETE details of a contact. */
router.delete("/:id/", deleteOne);

export default router;
