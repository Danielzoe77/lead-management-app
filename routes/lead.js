const express = require("express");
const router = express.Router();
const { createLead, getLeads } = require("../controllers/lead");
const auth = require("../middlewares/authMiddleware");

router.post("/", auth, createLead);  // protected
router.get("/", auth, getLeads);     // protected
// router.put("/:id", updateLead);
// router.delete("/:id", deleteLead);

module.exports = router;
