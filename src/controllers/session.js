import config from "../config/config.js";
import jwt from "jsonwebtoken";
import { serialize } from "../utils/utils.js";

const current = async (req, res) => {
  let user = serialize(req.user, [
    "first_name",
    "last_name",
    "role",
    "profile_picture",
    "cart",
  ]);
  res.send({ status: "success", payload: user });
};

const login = async (req, res) => {
  let user;
  if (req.user.role !== "superadmin") {
    user = serialize(req.user, ["first_name", "last_name"]);
  } else {
    user = req.user;
  }
  let token = jwt.sign(user, config.jwt.SECRET);
  res.cookie(config.jwt.COOKIE, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
  });
  res.cookie("sessionCookie", "boom", {
    maxAge: 60 * 60 * 1000,
  });
  res.send({ status: "success", payload: { user } });
};

const logout = async (req, res) => {
  res.clearCookie(config.jwt.COOKIE);
  res.send({ message: "Logged Out" });
};

export default {
  current,
  login,
  logout,
};
