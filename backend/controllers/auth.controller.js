const errorHandler = require("../utils/error.js");
const User = require("../models/user.model.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken")  ;


const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = new User({
        username,
        email,
        password: hashedPassword,
    });
    try {
        await user.save();
        return res.status(201).json({ user });
    } catch (error) {
        next(errorHandler(400, error.message));
    }
    }

const signin = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const validUser = await User.findOne({ username });
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }
        const validPassword = await bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Invalid password"));
        }
        const token = jwt.sign({ id : validUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const { password: pass, ...rest } = validUser._doc;
        res
            .cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json({ rest });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};


module.exports = { signup, signin };