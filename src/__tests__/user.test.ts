import mongoose from "mongoose";
import * as UserService from "../service/user.service";
import * as SessionService from "../service/session.service";
import supertest from "supertest";
import createServer from "../utils/server";
import { createUserSessionHandler } from "../controller/session.controller";

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

export const userPayload = {
  _id: userId,
  email: "john.die@example.com",
  name: "John Doe",
};

export const userInput = {
  email: "john.die@example.com",
  name: "John Doe",
  password: "Password123",
  passwordConfirmation: "Password123",
};

const sessionPayload = {
  _id: new mongoose.Types.ObjectId().toString(),
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.28.4",
  createdAt: new Date("2022-08-27T17:31:07.674Z"),
  updatedAt: new Date("2022-08-27T17:31:07.674Z"),
  __v: 0,
};

describe("user", () => {
  // user registration

  describe("user registration", () => {
    describe("given the username and password are valid", () => {
      it("should return the user paylod", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/users")
          .send(userInput);

        expect(statusCode).toBe(200);

        expect(body).toEqual(userPayload);

        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });

    describe("given the password do not match", () => {
      it("should return a 400", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          // @ts-ignore
          .mockReturnValueOnce(userPayload);

        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send({ ...userInput, passwordConfirmation: "doestnotmatch" });

        expect(statusCode).toBe(400);

        expect(createUserServiceMock).not.toHaveBeenCalled();
      });
    });

    describe("given the user service throws", () => {
      it("should a 409 error", async () => {
        const createUserServiceMock = jest
          .spyOn(UserService, "createUser")
          .mockRejectedValue("oh no :(");

        const { statusCode } = await supertest(app)
          .post("/api/users")
          .send(userInput);

        expect(statusCode).toBe(409);

        expect(createUserServiceMock).toHaveBeenCalled();
      });
    });
  });

  describe("create user session", () => {
    describe("given the username and password are valid", () => {
      it("should return a signed accesToken & refreshToken", async () => {
        jest
          .spyOn(UserService, "validatePassword")
          // @ts-ignore
          .mockReturnValue(userPayload);

        jest
          .spyOn(SessionService, "createSession")
          // @ts-ignore
          .mockReturnValue(sessionPayload);

        const req = {
          get: () => {
            return "a user agent";
          },
          body: {
            email: "test@example.com",
            password: "Password123",
          },
        };

        const send = jest.fn();

        const res = {
          send,
        };

        // @ts-ignore
        await createUserSessionHandler(req, res);

        expect(send).toHaveBeenCalledWith({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
    });
  });
  // the username and password get validation
  // verify that the passwords must match
  // verify that the handler handles any errors

  // creating a user session
  // a user can login wit a valid email and password
});
