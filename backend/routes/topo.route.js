const express = require("express");
const { topo } = require("../controllers/topo.controller.js");

const router = express.Router();

router.post("/topo", topo);

module.exports = router;