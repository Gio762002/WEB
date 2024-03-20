const errorHandler = require("../utils/error.js");
const User = require("../models/user.model.js");

const topo = async (req, res, next) => {
    res.json({ message: 'Hello, World!' })
    } 

module.exports = { topo };