import mongoose from "mongoose";
import * as UserService from "../service/user.service";
import supertest from "supertest";
import createServer from "../utils/server";

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
        expect(body).toBe(userPayload);

        expect(createUserServiceMock).toHaveBeenCalledWith(userInput);
      });
    });

    describe("given the password do not match", () => {
      it("should return a 400", () => {});
    });

    describe("given the user service throws", () => {
      it("should a 409 error", () => {});
    });
  });

  describe("create user session", () => {
    describe("given the username and password are valid", () => {
      it("should return a signed accesToken & refreshToken");
    });
  });
  // the username and password get validation
  // verify that the passwords must match
  // verify that the handler handles any errors

  // creating a user session
  // a user can login wit a valid email and password
});
