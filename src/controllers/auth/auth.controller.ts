import { Request, Response } from "express";
import { User } from "../../entity/user/User";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

export const signUp = async (
  req: Request,
  res: Response
): Promise<Response> => {
  let user = new User();
  const { email, password, firstName, lastName } = req.body;

  user.email = email;
  user.password = user.setPassword(password);
  user.firstName = firstName;
  user.lastName = lastName;

  const errors = await validate(user);

  if (errors.length > 0) {
    return res.status(400).send(errors);
  }

  const userRepository = getRepository(User);
  try {
    await userRepository.save(user);
  } catch (e) {
    return res.status(409).send("User already exists");
  }
  return res.status(201).send("User created successfully");
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  if (!(email && password)) {
    res.status(400).send();
  }

  const userRepository = getRepository(User);
  let user: User;

  try {
    const user = await userRepository.findOne({ email: email });
    if (user && !user.isValidPassword(password)) {
      return res.status(401).send("Incorrect credentials");
    }
    return res.status(200).json({ accesToken: user?.generateJWT() });
  } catch (e) {
    return res.status(401).send(e);
  }
};
