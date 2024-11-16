import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/lib/sessionhelper", () => ({
  getServerSession: vi.fn(),
}));
vi.mock("@/repositories/planRepository");
vi.mock("@/repositories/userRepository");

import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { compareBuilds } from "@/__tests__/comparatormethods";
import { generatePlan } from "@/__tests__/generatormethods";
import { GET, PUT } from "@/app/api/users/[userId]/plans/[planId]/route";
import { getServerSession } from "@/lib/sessionhelper";
import { getPlanById, updatePlan } from "@/repositories/planRepository";
import { getUserById } from "@/repositories/userRepository";
import { User } from "@/types";
import { getBaseUrl } from "@/utils/urlhelper";

const mockGetPlanById = getPlanById as Mock;
const mockGetServerSession = getServerSession as Mock;
const mockGetUserById = getUserById as Mock;
const mockUpdatePlan = updatePlan as Mock;

describe("/api/users/:userId/plans/:planId", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("GET", () => {
    describe("when the specified user exists", () => {
      describe("and matches the current session", () => {
        describe("and the specified plan exists", () => {
          describe("and it belongs to the specified user", () => {
            it("should return the requested plan", async () => {
              const email = uuidv4();
              const userId = uuidv4();
              const planId = uuidv4();
              const plan = generatePlan({ planId, userId });

              mockGetServerSession.mockReturnValue({ user: { email } });
              const user: User = { email, id: userId };
              mockGetUserById.mockReturnValue(user);
              mockGetPlanById.mockReturnValue(plan);

              const mockRequest: NextRequest = {
                url: `${getBaseUrl()}/api/users/${userId}/plans/${planId}`,
              } as NextRequest;
              const response = await GET(mockRequest, { params: { planId, userId } });

              expect(mockGetServerSession).toHaveBeenCalled();
              expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
              expect(mockGetPlanById).toHaveBeenCalledWith({ id: planId });

              expect(response.status).toBe(200);
              const responseBody = await response.json();
              compareBuilds({ actualBuilds: responseBody.builds, expectedBuilds: plan.builds });
              expect(responseBody.id).toBe(planId);
              expect(responseBody._links.self.href).toBe(`${getBaseUrl()}/api/users/${userId}/plans/${planId}`);
              expect(responseBody._links.self.id).toBe(planId);
              expect(responseBody._links.user.href).toBe(`${getBaseUrl()}/api/users/${userId}`);
              expect(responseBody._links.user.id).toBe(userId);
            });
          });

          describe("and it does not to the specified user", () => {
            it("should return a 403", async () => {
              const email = uuidv4();
              const userId = uuidv4();
              const planId = uuidv4();
              const plan = generatePlan({ planId, userId: uuidv4() });

              mockGetServerSession.mockReturnValue({ user: { email } });
              const user: User = { email, id: userId };
              mockGetUserById.mockReturnValue(user);
              mockGetPlanById.mockReturnValue(plan);

              const mockRequest: NextRequest = {
                url: `${getBaseUrl()}/api/users/${userId}/plans/${planId}`,
              } as NextRequest;
              const response = await GET(mockRequest, { params: { planId, userId } });

              expect(mockGetServerSession).toHaveBeenCalled();
              expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
              expect(mockGetPlanById).toHaveBeenCalledWith({ id: planId });

              expect(response.status).toBe(403);
            });
          });
        });

        describe("and the specified plan does not exist", () => {
          it("should return a 403", async () => {
            const email = uuidv4();
            const userId = uuidv4();
            const planId = uuidv4();

            mockGetServerSession.mockReturnValue({ user: { email } });
            const user: User = { email, id: userId };
            mockGetUserById.mockReturnValue(user);
            mockGetPlanById.mockReturnValue(undefined);

            const mockRequest: NextRequest = {
              url: `${getBaseUrl()}/api/users/${userId}/plans/${planId}`,
            } as NextRequest;
            const response = await GET(mockRequest, { params: { planId, userId } });

            expect(mockGetServerSession).toHaveBeenCalled();
            expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
            expect(mockGetPlanById).toHaveBeenCalledWith({ id: planId });

            expect(response.status).toBe(403);
          });
        });
      });

      describe("and does not match the current session", () => {
        it("should return a 403", async () => {
          const email = uuidv4();
          const userId = uuidv4();
          const planId = uuidv4();

          mockGetServerSession.mockReturnValue({ user: { email: uuidv4() } });
          const user: User = { email, id: userId };
          mockGetUserById.mockReturnValue(user);

          const mockRequest: NextRequest = {
            url: `${getBaseUrl()}/api/users/${userId}/plans/${planId}`,
          } as NextRequest;
          const response = await GET(mockRequest, { params: { planId, userId } });

          expect(mockGetServerSession).toHaveBeenCalled();
          expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
          expect(mockGetPlanById).not.toHaveBeenCalled();

          expect(response.status).toBe(403);
        });
      });
    });

    describe("when the specified user does not exist", () => {
      it("should return a 403", async () => {
        const email = uuidv4();
        const userId = uuidv4();
        const planId = uuidv4();

        mockGetServerSession.mockReturnValue({ user: { email } });
        mockGetUserById.mockReturnValue(undefined);

        const mockRequest: NextRequest = {
          url: `${getBaseUrl()}/api/users/${userId}/plans/${planId}`,
        } as NextRequest;
        const response = await GET(mockRequest, { params: { planId, userId } });

        expect(mockGetServerSession).toHaveBeenCalled();
        expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
        expect(mockGetPlanById).not.toHaveBeenCalled();

        expect(response.status).toBe(403);
      });
    });
  });

  describe("PUT", () => {
    describe("when the specified user exists", () => {
      describe("and matches the current session", () => {
        describe("and the specified plan exists", () => {
          describe("and it belongs to the specified user", () => {
            it("should update the specified plan and return it", async () => {
              const email = uuidv4();
              const userId = uuidv4();
              const planId = uuidv4();
              const existingPlan = generatePlan({ planId, userId });
              const newPlan = generatePlan({ planId, userId });

              mockGetServerSession.mockReturnValue({ user: { email } });
              const user: User = { email, id: userId };
              mockGetUserById.mockReturnValue(user);
              mockGetPlanById.mockReturnValue(existingPlan);
              mockUpdatePlan.mockReturnValue(newPlan);

              const mockRequest: NextRequest = {
                json: async () => newPlan,
                url: `${getBaseUrl()}/api/users/${userId}/plans`,
              } as NextRequest;
              const response = await PUT(mockRequest, { params: { planId, userId } });

              expect(mockGetServerSession).toHaveBeenCalled();
              expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
              expect(mockGetPlanById).toHaveBeenCalledWith({ id: planId });
              expect(mockUpdatePlan).toHaveBeenCalledWith({ id: planId, plan: newPlan });

              expect(response.status).toBe(200);
              const responseBody = await response.json();

              expect(responseBody.id).toBe(planId);
              compareBuilds({ actualBuilds: responseBody.builds, expectedBuilds: newPlan.builds });
              expect(responseBody._links.self.href).toBe(`${getBaseUrl()}/api/users/${userId}/plans/${planId}`);
              expect(responseBody._links.self.id).toBe(planId);
            });
          });

          describe("and it does not belong to the specified user", () => {
            it("should return a 403", async () => {
              const email = uuidv4();
              const userId = uuidv4();
              const planId = uuidv4();
              const existingPlan = generatePlan({ planId, userId: uuidv4() });
              const newPlan = generatePlan({ planId, userId });

              mockGetServerSession.mockReturnValue({ user: { email } });
              const user: User = { email, id: userId };
              mockGetUserById.mockReturnValue(user);
              mockGetPlanById.mockReturnValue(existingPlan);

              const mockRequest: NextRequest = {
                json: async () => newPlan,
                url: `${getBaseUrl()}/api/users/${userId}/plans`,
              } as NextRequest;
              const response = await PUT(mockRequest, { params: { planId, userId } });

              expect(mockGetServerSession).toHaveBeenCalled();
              expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
              expect(mockGetPlanById).toHaveBeenCalledWith({ id: planId });
              expect(mockUpdatePlan).not.toHaveBeenCalled();

              expect(response.status).toBe(403);
            });
          });
        });

        describe("and the specified plan does not exist", () => {
          it("should return a 403", async () => {
            const email = uuidv4();
            const userId = uuidv4();
            const planId = uuidv4();
            const newPlan = generatePlan({ planId, userId });

            mockGetServerSession.mockReturnValue({ user: { email } });
            const user: User = { email, id: userId };
            mockGetUserById.mockReturnValue(user);
            mockGetPlanById.mockReturnValue(undefined);
            mockUpdatePlan.mockReturnValue(newPlan);

            const mockRequest: NextRequest = {
              json: async () => newPlan,
              url: `${getBaseUrl()}/api/users/${userId}/plans`,
            } as NextRequest;
            const response = await PUT(mockRequest, { params: { planId, userId } });

            expect(mockGetServerSession).toHaveBeenCalled();
            expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
            expect(mockGetPlanById).toHaveBeenCalledWith({ id: planId });
            expect(mockUpdatePlan).not.toHaveBeenCalled();

            expect(response.status).toBe(403);
          });
        });
      });

      describe("and does not match the current session", () => {
        it("should return a 403", async () => {
          const email = uuidv4();
          const userId = uuidv4();
          const planId = uuidv4();
          const existingPlan = generatePlan({ planId, userId });
          const newPlan = generatePlan({ planId, userId });

          mockGetServerSession.mockReturnValue({ user: { email: uuidv4() } });
          const user: User = { email, id: userId };
          mockGetUserById.mockReturnValue(user);
          mockGetPlanById.mockReturnValue(existingPlan);
          mockUpdatePlan.mockReturnValue(newPlan);

          const mockRequest: NextRequest = {
            json: async () => newPlan,
            url: `${getBaseUrl()}/api/users/${userId}/plans`,
          } as NextRequest;
          const response = await PUT(mockRequest, { params: { planId, userId } });

          expect(mockGetServerSession).toHaveBeenCalled();
          expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
          expect(mockGetPlanById).not.toHaveBeenCalled();
          expect(mockUpdatePlan).not.toHaveBeenCalled();

          expect(response.status).toBe(403);
        });
      });
    });

    describe("when the specified user does not exist", () => {
      it("should return a 403", async () => {
        const email = uuidv4();
        const userId = uuidv4();
        const planId = uuidv4();
        const existingPlan = generatePlan({ planId, userId });
        const newPlan = generatePlan({ planId, userId });

        mockGetServerSession.mockReturnValue({ user: { email } });
        mockGetUserById.mockReturnValue(undefined);
        mockGetPlanById.mockReturnValue(existingPlan);
        mockUpdatePlan.mockReturnValue(newPlan);

        const mockRequest: NextRequest = {
          json: async () => newPlan,
          url: `${getBaseUrl()}/api/users/${userId}/plans`,
        } as NextRequest;
        const response = await PUT(mockRequest, { params: { planId, userId } });

        expect(mockGetServerSession).toHaveBeenCalled();
        expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
        expect(mockGetPlanById).not.toHaveBeenCalled();
        expect(mockUpdatePlan).not.toHaveBeenCalled();

        expect(response.status).toBe(403);
      });
    });
  });
});
