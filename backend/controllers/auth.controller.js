const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        email,
        password: hashedPassword,
    });
    try {
        await user.save();
        return res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
    }