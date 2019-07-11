import { Router } from "express";

const router = Router();

/* GET home page. */
router.get("/", function(_req, res) {
  res.status(200).json({
    message: "welcome onboard"
  });
});

/* GET api endpoint. */
router.get("/api", function(_req, res) {
  res.status(200).render("docs");
});

export default router;
