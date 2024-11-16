import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/lib/sessionhelper", () => ({
  getServerSession: vi.fn(),
}));
vi.mock("@/repositories/userRepository");

import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { GET, POST } from "@/app/api/users/route";
import { getServerSession } from "@/lib/sessionhelper";
import { createUser, getUserByEmail } from "@/repositories/userRepository";
import { User } from "@/types";
import { getBaseUrl } from "@/utils/urlhelper";

const mockGetServerSession = getServerSession as Mock;
const mockCreateUser = createUser as Mock;
const mockGetUserByEmail = getUserByEmail as Mock;

describe("/api/users", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("GET", () => {
    it("should return a list containing only the user associated with the current session", async () => {
      const email = uuidv4();
      const userId = uuidv4();

      mockGetServerSession.mockReturnValue({ user: { email } });
      const user: User = { email, id: userId };
      mockGetUserByEmail.mockReturnValue(user);

      const mockRequest: NextRequest = {
        url: `${getBaseUrl()}/api/users`,
      } as NextRequest;
      const response = await GET(mockRequest);

      expect(mockGetServerSession).toHaveBeenCalled();
      expect(mockGetUserByEmail).toHaveBeenCalledWith({ email });

      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody._embedded.users.length).toBe(1);
      expect(responseBody._embedded.users[0]._links.self.href).toBe(`${getBaseUrl()}/api/users/${userId}`);
      expect(responseBody._embedded.users[0]._links.self.id).toBe(userId);
      expect(responseBody._embedded.users[0].email).toBe(email);
      expect(responseBody._embedded.users[0].id).toBe(userId);
      expect(responseBody._links.self.href).toBe(`${getBaseUrl()}/api/users`);
    });

    describe("when the query string matches the current session", () => {
      it("should return a list containing only the user associated with the current session", async () => {
        const email = uuidv4();
        const userId = uuidv4();

        mockGetServerSession.mockReturnValue({ user: { email } });
        const user: User = { email, id: userId };
        mockGetUserByEmail.mockReturnValue(user);

        const mockRequest: NextRequest = {
          url: `${getBaseUrl()}/api/users?email=${email}`,
        } as NextRequest;
        const response = await GET(mockRequest);

        expect(mockGetServerSession).toHaveBeenCalled();
        expect(mockGetUserByEmail).toHaveBeenCalledWith({ email });

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody._embedded.users.length).toBe(1);
        expect(responseBody._embedded.users[0]._links.self.href).toBe(`${getBaseUrl()}/api/users/${userId}`);
        expect(responseBody._embedded.users[0]._links.self.id).toBe(userId);
        expect(responseBody._embedded.users[0].email).toBe(email);
        expect(responseBody._embedded.users[0].id).toBe(userId);
        expect(responseBody._links.self.href).toBe(`${getBaseUrl()}/api/users`);
      });
    });

    describe("when the query string does not match the current session", () => {
      it("should return an empty list of users", async () => {
        const email = uuidv4();
        const userId = uuidv4();

        mockGetServerSession.mockReturnValue({ user: { email: uuidv4() } });
        const user: User = { email, id: userId };
        mockGetUserByEmail.mockReturnValue(user);

        const mockRequest: NextRequest = {
          url: `${getBaseUrl()}/api/users?email=${email}`,
        } as NextRequest;
        const response = await GET(mockRequest);

        expect(mockGetServerSession).toHaveBeenCalled();
        expect(mockGetUserByEmail).not.toHaveBeenCalled();

        expect(response.status).toBe(200);
        const responseBody = await response.json();
        expect(responseBody._embedded.users.length).toBe(0);
        expect(responseBody._links.self.href).toBe(`${getBaseUrl()}/api/users`);
      });
    });
  });

  describe("POST", () => {
    describe("when a user associated with the current session does not exist", () => {
      describe("and the request body matches the current session", () => {
        it("should create a new user and return it", async () => {
          const email = uuidv4();
          const userId = uuidv4();

          mockGetServerSession.mockReturnValue({ user: { email } });
          const user: User = { email, id: userId };
          mockGetUserByEmail.mockReturnValue(undefined);
          mockCreateUser.mockReturnValue(user);

          const mockRequest: NextRequest = {
            json: async () => ({ email }),
            url: `${getBaseUrl()}/api/users`,
          } as NextRequest;
          const response = await POST(mockRequest);

          expect(response.status).toBe(201);
          const responseBody = await response.json();
          expect(responseBody._links.self.href).toBe(`${getBaseUrl()}/api/users/${userId}`);
          expect(responseBody._links.self.id).toBe(userId);
          expect(responseBody.email).toBe(email);
          expect(responseBody.id).toBe(userId);
        });
      });

      describe("and the request body does not match the current session", () => {
        it("should return a 403", async () => {
          const email = uuidv4();
          const userId = uuidv4();

          mockGetServerSession.mockReturnValue({ user: { email: uuidv4() } });
          const user: User = { email, id: userId };
          mockGetUserByEmail.mockReturnValue(undefined);
          mockCreateUser.mockReturnValue(user);

          const mockRequest: NextRequest = {
            json: async () => ({ email }),
            url: `${getBaseUrl()}/api/users`,
          } as NextRequest;
          const response = await POST(mockRequest);

          expect(response.status).toBe(403);
        });
      });
    });

    describe("when a user associated with the current session already exists", () => {
      describe("and the request body matches the current session", () => {
        it("should return a 400", async () => {
          const email = uuidv4();
          const userId = uuidv4();

          mockGetServerSession.mockReturnValue({ user: { email } });
          const user: User = { email, id: userId };
          mockGetUserByEmail.mockReturnValue(user);
          mockCreateUser.mockReturnValue(user);

          const mockRequest: NextRequest = {
            json: async () => ({ email }),
            url: `${getBaseUrl()}/api/users`,
          } as NextRequest;
          const response = await POST(mockRequest);

          expect(response.status).toBe(400);
        });
      });

      describe("and the request body does not match the current session", () => {
        it("should return a 403", async () => {
          const email = uuidv4();
          const userId = uuidv4();

          mockGetServerSession.mockReturnValue({ user: { email: uuidv4() } });
          const user: User = { email, id: userId };
          mockGetUserByEmail.mockReturnValue(undefined);
          mockCreateUser.mockReturnValue(user);

          const mockRequest: NextRequest = {
            json: async () => ({ email }),
            url: `${getBaseUrl()}/api/users`,
          } as NextRequest;
          const response = await POST(mockRequest);

          expect(response.status).toBe(403);
        });
      });
    });
  });
});
