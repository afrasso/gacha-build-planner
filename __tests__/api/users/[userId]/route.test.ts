import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/lib/sessionhelper", () => ({
  getServerSession: vi.fn(),
}));
vi.mock("@/repositories/userRepository");

import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { GET, PUT } from "@/app/api/users/[userId]/route"; // Adjust path based on your structure
import { getServerSession } from "@/lib/sessionhelper";
import { getUserById } from "@/repositories/userRepository";
import { User } from "@/types";
import { getBaseUrl } from "@/utils/urlhelper";

const mockGetServerSession = getServerSession as Mock;
const mockGetUserById = getUserById as Mock;

describe("/api/users/:userId", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("GET", () => {
    describe("when the specified user exists", () => {
      describe("and matches the current session", () => {
        it("should return the requested user", async () => {
          const email = uuidv4();
          const userId = uuidv4();

          mockGetServerSession.mockReturnValue({ user: { email } });
          const user: User = { email, id: userId };
          mockGetUserById.mockReturnValue(user);

          const mockRequest: NextRequest = {
            url: `${getBaseUrl()}/api/users/${userId}`,
          } as NextRequest;
          const response = await GET(mockRequest, { params: { userId } });

          expect(mockGetServerSession).toHaveBeenCalled();
          expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });

          expect(response.status).toBe(200);
          const responseBody = await response.json();
          expect(responseBody.email).toBe(email);
          expect(responseBody.id).toBe(userId);
          expect(responseBody._links.self.href).toBe(`${getBaseUrl()}/api/users/${userId}`);
          expect(responseBody._links.self.id).toBe(userId);
        });
      });

      describe("and does not match the current session", () => {
        it("should return a 403", async () => {
          const email = uuidv4();
          const userId = uuidv4();

          mockGetServerSession.mockReturnValue({ user: { email: uuidv4() } });
          const user: User = { email, id: userId };
          mockGetUserById.mockReturnValue(user);

          const mockRequest: NextRequest = {
            url: `${getBaseUrl()}/api/users/${userId}`,
          } as NextRequest;
          const response = await GET(mockRequest, { params: { userId } });

          expect(mockGetServerSession).toHaveBeenCalled();
          expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });

          expect(response.status).toBe(403);
        });
      });
    });

    describe("when the specified user does not exist", () => {
      it("should return a 403", async () => {
        const email = uuidv4();
        const userId = uuidv4();

        mockGetServerSession.mockReturnValue({ user: { email } });
        mockGetUserById.mockReturnValue(undefined);

        const mockRequest: NextRequest = {
          url: `${getBaseUrl()}/api/users/${userId}`,
        } as NextRequest;
        const response = await GET(mockRequest, { params: { userId } });

        expect(mockGetServerSession).toHaveBeenCalled();
        expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });

        expect(response.status).toBe(403);
      });
    });
  });

  describe("PUT", () => {
    describe("when the specified user exists", () => {
      describe("and matches the current session", () => {
        describe("and the specified email matches the existing email ", () => {
          it("should return a 200", async () => {
            const email = uuidv4();
            const userId = uuidv4();

            mockGetServerSession.mockReturnValue({ user: { email } });
            const user: User = { email, id: userId };
            mockGetUserById.mockReturnValue(user);

            const mockRequest: NextRequest = {
              json: async () => ({ email }),
              url: `${getBaseUrl()}/api/users/${userId}`,
            } as NextRequest;
            const response = await PUT(mockRequest, { params: { userId } });

            expect(mockGetServerSession).toHaveBeenCalled();
            expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });

            expect(response.status).toBe(200);
          });
        });

        describe("and the specified email does not match the existing email", () => {
          it("should return a 400", async () => {
            const email = uuidv4();
            const userId = uuidv4();

            mockGetServerSession.mockReturnValue({ user: { email } });
            const user: User = { email, id: userId };
            mockGetUserById.mockReturnValue(user);

            const mockRequest: NextRequest = {
              json: async () => ({ email: uuidv4() }),
              url: `${getBaseUrl()}/api/users/${userId}`,
            } as NextRequest;
            const response = await PUT(mockRequest, { params: { userId } });

            expect(mockGetServerSession).toHaveBeenCalled();
            expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });

            expect(response.status).toBe(400);
          });
        });
      });

      describe("and does not match the current session", () => {
        it("should return a 403", async () => {
          const email = uuidv4();
          const userId = uuidv4();

          mockGetServerSession.mockReturnValue({ user: { email: uuidv4() } });
          const user: User = { email, id: userId };
          mockGetUserById.mockReturnValue(user);

          const mockRequest: NextRequest = {
            json: async () => ({ email }),
            url: `${getBaseUrl()}/api/users/${userId}`,
          } as NextRequest;
          const response = await PUT(mockRequest, { params: { userId } });

          expect(mockGetServerSession).toHaveBeenCalled();
          expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });

          expect(response.status).toBe(403);
        });
      });
    });

    describe("when the specified user does not exist", () => {
      it("should return a 403", async () => {
        const email = uuidv4();
        const userId = uuidv4();

        mockGetServerSession.mockReturnValue({ user: { email } });
        mockGetUserById.mockReturnValue(undefined);

        const mockRequest: NextRequest = {
          url: `${getBaseUrl()}/api/users/${userId}`,
        } as NextRequest;
        const response = await PUT(mockRequest, { params: { userId } });

        expect(mockGetServerSession).toHaveBeenCalled();
        expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });

        expect(response.status).toBe(403);
      });
    });
  });
});
