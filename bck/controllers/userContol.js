import User from "../module/userModel.js";
import bcrypt from "bcrypt";
import generateTokenAndCookies from "../utils/genTokenCookie.js";

export const test = (req, res) => {
  res.status(200).json({ message: "Hello world" });
};

// export const signup = async (req, res) => {
//   const { username, name, email, password } = req.body;
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   const newUser = new User({ username, name, email, password: hashedPassword });
//   try {
//     await newUser.save();
//     res.status(200).json("user Created successfully");
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// };

export const signup = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) return res.status(404).json({ error: "user already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      name,
      password: hashedPassword,
      email,
    });

    await newUser.save();

    if (newUser) {
      generateTokenAndCookies(newUser._id, res);

      res.status(200).json({
        _id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      });
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const isValidPassword = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isValidPassword)
      return res.status(403).json({ error: "Invalid password or username" });

    if (user) {
      (user.isFrozen = true), await user.save();
    }

    generateTokenAndCookies(user._id, res);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// export const update = async (req, res) => {
//   const { id } = req.params;
//   const user = await User.findOneById(id);
//   const currentUser = await User.findOneById(req.user._id);

//   if (id !== req.user._id.toString())
//     return res.status(404).json({ error: "cant update account" });

//   const updatedUser = await User.findByIdAndUpdate(
//     id,
//     {
//       $set: {
//         username: req.body.username,
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password,
//         avatar: req.body.avatar,
//       },
//     },
//     { new: true }
//   );

//   const { password, ...rest } = updatedUser._doc;
// };

export const update = async (req, res) => {
  if (req.user._id !== req.params.id)
    return res.status(401).json({ error: "you can update your own account" });
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.stats(200).json(rest);
  } catch (err) {
    res.status(500).json({ error: "User could not be updated" });
  }
};
