import jwt from "jsonwebtoken";

const generateTokenAndCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: true,
  });

  return token;
};

export default generateTokenAndCookies;
