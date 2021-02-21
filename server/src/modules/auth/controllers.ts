import express from "express";
import jwt from "jsonwebtoken";
import User from "./models/User";
import Role from "./models/Role";
import config from "config";
import { handleError, generatePassword, isPasswordsEqual } from "tools";
import { UserType } from "./models/User";
import { UserRoles } from "./models/Role";

interface LoginRequestType extends express.Request {
  body: {
    login: string;
    password: string;
  }
}

interface RegRequestType extends LoginRequestType {
  body: {
    login: string;
    email: string;
    password: string;
    repeatPassword: string;
    lastName?: string;
    firstName?: string;
    middleName?: string;
  }
}

const generateTokenAndWriteToCookie = (user: UserType, response: express.Response) => {
  // генерируем токен
  const token = jwt.sign({
    _id: user._id,
    email: user.email,
    login: user.login,
    roles: user.roles,
  }, config.jwt.secretOrKey, {
    expiresIn: config.jwt.maxAge, // час
  });
  response.cookie("jwt", token, {
    maxAge: config.jwt.maxAge * 1000,
    secure: false,
    httpOnly: false,
  });
  return token;
};

export const login = async (req: LoginRequestType, res: express.Response): Promise<unknown> => {
  try {
    if (!req.body.password || !req.body.login) {
      throw new Error("Отсутствуют обязательные поля!");
    }

    let candidate = await User.findOne({ login: req.body.login });
    if (!candidate) {
      candidate = await User.findOne({ email: req.body.login });
    }
    if (!candidate) {
      return res.status(404).end("Пользователь с такими данными не найден.");
    }
    const passwordsEquals = isPasswordsEqual(req.body.password, candidate.password);
    if (!passwordsEquals) {
      return res.status(401).end("Неверный пароль.");
    }
    generateTokenAndWriteToCookie(candidate, res);
    return res.status(200).json({ user: candidate });
  } catch (err) {
    handleError(res, err);
  }
};

export const register = async (req: RegRequestType, res: express.Response): Promise<unknown> => {
  try {
    if (!req.body.password || !req.body.login || !req.body.repeatPassword || !req.body.email) {
      throw new Error("Отсутствуют обязательные поля!");
    }
    if (req.body.login.length < 3) {
      throw new Error("Минимальная длина логина 3 символа!");
    }
    if (req.body.password.length < 5 || req.body.repeatPassword.length < 5) {
      throw new Error("Минимальная длина пароля 5 символов!");
    }

    if (req.body.password !== req.body.repeatPassword) {
      throw new Error("Пароли должны совпадать");
    }
    let candidate = await User.findOne({ email: req.body.email });
    if (candidate) {
      return res.status(400).end("Пользователь c таким email уже зарегистрирован.");
    }
    candidate = await User.findOne({ login: req.body.login });
    if (candidate) {
      return res.status(400).end("Пользователь c таким логином уже зарегистрирован.");
    }
    let role = await Role.findOne({ name: UserRoles.user });
    if (!role) {
      role = await Role.create({ name: UserRoles.user });
    }
    const user = new User({
      email: req.body.email,
      login: req.body.login,
      password: generatePassword(req.body.password),
      roles: [role.name],
    });
    await user.save();
    generateTokenAndWriteToCookie(user, res);
    return res.status(201).json({ user });
  } catch (err) {
    handleError(res, err);
  }
};