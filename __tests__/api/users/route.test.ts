import { describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/lib/sessionhelper", () => ({
  getServerSession: vi.fn(),
}));
vi.mock("@/repositories/userRepository");

import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { getServerSession } from "@/lib/sessionhelper";
import { createUser, getUserByEmail } from "@/repositories/userRepository";
import { User } from "@/types";

import { GET, POST } from "../../../app/api/users/route"; // Adjust path based on your structure

const mockGetServerSession = getServerSession as Mock;
const mockCreateUser = createUser as Mock;
const mockGetUserByEmail = getUserByEmail as Mock;

describe("/api/users", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("GET", () => {
    it("returns a list containing only the user that matches the session email", async () => {
      const email = uuidv4();
      const id = uuidv4();

      mockGetServerSession.mockReturnValue({ user: { email } });
      const user: User = { email, id };
      mockGetUserByEmail.mockReturnValue(user);

      const mockRequest: NextRequest = {
        url: "http://localhost:3000/api/users",
      } as NextRequest;
      const response = await GET(mockRequest);

      expect(mockGetServerSession).toHaveBeenCalled();
      expect(mockGetUserByEmail).toHaveBeenCalledWith({ email });

      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody._embedded.users.length).toBe(1);
      expect(responseBody._embedded.users[0]._links.self.href).toBe(`http://localhost:3000/api/users/${id}`);
      expect(responseBody._embedded.users[0]._links.self.id).toBe(id);
      expect(responseBody._embedded.users[0].email).toBe(email);
      expect(responseBody._embedded.users[0].id).toBe(id);
      expect(responseBody._links.self.href).toBe("http://localhost:3000/api/users");
    });

    describe("when the query string contains an email that matches the session email", () => {
      it("returns a list containing only the user that matches the session email", async () => {
        const email = uuidv4();
        const id = uuidv4();

        mockGetServerSession.mockReturnValue({ user: { email } });
        const user: User = { email, id };
        mockGetUserByEmail.mockReturnValue(user);

        const mockRequest: NextRequest = {
          url: `http://localhost:3000/api/users?email=${email}`,
        } as NextRequest;
        const response = await GET(mockRequest);

        expect(mockGetServerSession).toHaveBeenCalled();
        expect(mockGetUserByEmail).toHaveBeenCalledWith({ email });

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody._embedded.users.length).toBe(1);
        expect(responseBody._embedded.users[0]._links.self.href).toBe(`http://localhost:3000/api/users/${id}`);
        expect(responseBody._embedded.users[0]._links.self.id).toBe(id);
        expect(responseBody._embedded.users[0].email).toBe(email);
        expect(responseBody._embedded.users[0].id).toBe(id);
        expect(responseBody._links.self.href).toBe("http://localhost:3000/api/users");
      });
    });

    describe("when the query string contains an email that matches the session email", () => {
      it("it should return an empty list of users", async () => {
        const email = uuidv4();
        const id = uuidv4();

        mockGetServerSession.mockReturnValue({ user: { email: uuidv4() } });
        const user: User = { email, id };
        mockGetUserByEmail.mockReturnValue(user);

        const mockRequest: NextRequest = {
          url: `http://localhost:3000/api/users?email=${email}`,
        } as NextRequest;
        const response = await GET(mockRequest);

        expect(mockGetServerSession).toHaveBeenCalled();
        expect(mockGetUserByEmail).not.toHaveBeenCalled();

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody._embedded.users.length).toBe(0);
        expect(responseBody._links.self.href).toBe("http://localhost:3000/api/users");
      });
    });
  });

  describe("POST", () => {
    describe("when a user associated with the session email does not exist", () => {
      describe("and the request body matches the session email", () => {
        it("creates a new user and returns it", async () => {
          const email = uuidv4();
          const id = uuidv4();

          mockGetServerSession.mockReturnValue({ user: { email } });
          const user: User = { email, id };
          mockGetUserByEmail.mockReturnValue(undefined);
          mockCreateUser.mockReturnValue(user);

          const mockRequest: NextRequest = {
            json: async () => ({ email }),
            url: "http://localhost:3000/api/users",
          } as NextRequest;
          const response = await POST(mockRequest);

          expect(response.status).toBe(201);
          const responseBody = await response.json();
          expect(responseBody._links.self.href).toBe(`http://localhost:3000/api/users/${id}`);
          expect(responseBody._links.self.id).toBe(id);
          expect(responseBody.email).toBe(email);
          expect(responseBody.id).toBe(id);
        });
      });

      describe("and the request body doesn't match the session email", () => {
        it("returns a 403", async () => {
          const email = uuidv4();
          const id = uuidv4();

          mockGetServerSession.mockReturnValue({ user: { email: uuidv4() } });
          const user: User = { email, id };
          mockGetUserByEmail.mockReturnValue(undefined);
          mockCreateUser.mockReturnValue(user);

          const mockRequest: NextRequest = {
            json: async () => ({ email }),
            url: "http://localhost:3000/api/users",
          } as NextRequest;
          const response = await POST(mockRequest);

          expect(response.status).toBe(403);
        });
      });
    });

    describe("when a user associated with the session email already exists", () => {
      describe("and the request body matches the session email", () => {
        it("returns a 400", async () => {
          const email = uuidv4();
          const id = uuidv4();

          mockGetServerSession.mockReturnValue({ user: { email } });
          const user: User = { email, id };
          mockGetUserByEmail.mockReturnValue(user);
          mockCreateUser.mockReturnValue(user);

          const mockRequest: NextRequest = {
            json: async () => ({ email }),
            url: "http://localhost:3000/api/users",
          } as NextRequest;
          const response = await POST(mockRequest);

          expect(response.status).toBe(400);
        });
      });

      describe("and the request body doesn't match the session email", () => {
        it("returns a 403", async () => {
          const email = uuidv4();
          const id = uuidv4();

          mockGetServerSession.mockReturnValue({ user: { email: uuidv4() } });
          const user: User = { email, id };
          mockGetUserByEmail.mockReturnValue(undefined);
          mockCreateUser.mockReturnValue(user);

          const mockRequest: NextRequest = {
            json: async () => ({ email }),
            url: "http://localhost:3000/api/users",
          } as NextRequest;
          const response = await POST(mockRequest);

          expect(response.status).toBe(403);
        });
      });
    });
  });
});
