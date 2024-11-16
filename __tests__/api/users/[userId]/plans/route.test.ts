import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/lib/sessionhelper", () => ({
  getServerSession: vi.fn(),
}));
vi.mock("@/repositories/planRepository");
vi.mock("@/repositories/userRepository");

import _ from "lodash";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { compareBuilds } from "@/__tests__/comparatormethods";
import { generatePlan } from "@/__tests__/generatormethods";
import * as API from "@/app/api/types";
import { GET, POST } from "@/app/api/users/[userId]/plans/route";
import { getServerSession } from "@/lib/sessionhelper";
import { createPlanForUser, getPlansByUserId } from "@/repositories/planRepository";
import { getUserById } from "@/repositories/userRepository";
import { User } from "@/types";
import { getBaseUrl } from "@/utils/urlhelper";

const mockCreatePlanForUser = createPlanForUser as Mock;
const mockGetPlansByUserId = getPlansByUserId as Mock;
const mockGetServerSession = getServerSession as Mock;
const mockGetUserById = getUserById as Mock;

describe("/api/users/:userId/plans", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("GET", () => {
    describe("when the specified user exists", () => {
      describe("and matches the current session", () => {
        describe("and the specified user has a plan", () => {
          it("should return a list containing only the specified user's plan", async () => {
            const email = uuidv4();
            const userId = uuidv4();
            const plans = _.times(3, () => generatePlan({ planId: uuidv4(), userId }));

            mockGetServerSession.mockReturnValue({ user: { email } });
            const user: User = { email, id: userId };
            mockGetUserById.mockReturnValue(user);
            mockGetPlansByUserId.mockReturnValue(plans);

            const mockRequest: NextRequest = {
              url: `${getBaseUrl()}/api/users/${userId}/plans`,
            } as NextRequest;
            const response = await GET(mockRequest, { params: { userId } });

            expect(mockGetServerSession).toHaveBeenCalled();
            expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
            expect(mockGetPlansByUserId).toHaveBeenCalledWith({ userId });

            expect(response.status).toBe(200);
            const responseBody = await response.json();
            expect(responseBody._embedded.plans.length).toBe(plans.length);

            plans.forEach((expectedPlan) => {
              const actualPlan: API.Plan = responseBody._embedded.plans.find(
                (plan: API.Plan) => plan.id === expectedPlan.id
              );
              compareBuilds({ actualBuilds: actualPlan.builds, expectedBuilds: expectedPlan.builds });
              expect(actualPlan._links.self.href).toBe(`${getBaseUrl()}/api/users/${userId}/plans/${expectedPlan.id}`);
              expect(actualPlan._links.self.id).toBe(expectedPlan.id);
              expect(actualPlan._links.user.href).toBe(`${getBaseUrl()}/api/users/${userId}`);
              expect(actualPlan._links.user.id).toBe(userId);
            });

            expect(responseBody._links.self.href).toBe(`${getBaseUrl()}/api/users/${userId}/plans`);
          });
        });

        describe("and the specified user does not have a plan", () => {
          it("should return an empty list of plans", async () => {
            const email = uuidv4();
            const userId = uuidv4();

            mockGetServerSession.mockReturnValue({ user: { email } });
            const user: User = { email, id: userId };
            mockGetUserById.mockReturnValue(user);
            mockGetPlansByUserId.mockReturnValue([]);

            const mockRequest: NextRequest = {
              url: `${getBaseUrl()}/api/users/${userId}/plans`,
            } as NextRequest;
            const response = await GET(mockRequest, { params: { userId } });

            expect(mockGetServerSession).toHaveBeenCalled();
            expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
            expect(mockGetPlansByUserId).toHaveBeenCalledWith({ userId });

            expect(response.status).toBe(200);
            const responseBody = await response.json();
            expect(responseBody._embedded.plans.length).toBe(0);
            expect(responseBody._links.self.href).toBe(`${getBaseUrl()}/api/users/${userId}/plans`);
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
            url: `${getBaseUrl()}/api/users/${userId}/plans`,
          } as NextRequest;
          const response = await GET(mockRequest, { params: { userId } });

          expect(mockGetServerSession).toHaveBeenCalled();
          expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
          expect(mockGetPlansByUserId).not.toHaveBeenCalled();

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
          url: `${getBaseUrl()}/api/users/${userId}/plans`,
        } as NextRequest;
        const response = await GET(mockRequest, { params: { userId } });

        expect(mockGetServerSession).toHaveBeenCalled();
        expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
        expect(mockGetPlansByUserId).not.toHaveBeenCalled();

        expect(response.status).toBe(403);
      });
    });
  });

  describe("POST", () => {
    describe("when the specified user exists", () => {
      describe("and matches the current session", () => {
        describe("and the specified user does not have a plan", () => {
          it("should create a new plan and return it", async () => {
            const email = uuidv4();
            const userId = uuidv4();
            const planId = uuidv4();
            const plan = generatePlan({ planId, userId });

            mockGetServerSession.mockReturnValue({ user: { email } });
            const user: User = { email, id: userId };
            mockGetUserById.mockReturnValue(user);
            mockGetPlansByUserId.mockReturnValue([]);
            mockCreatePlanForUser.mockReturnValue(plan);

            const mockRequest: NextRequest = {
              json: async () => plan,
              url: `${getBaseUrl()}/api/users/${userId}/plans`,
            } as NextRequest;
            const response = await POST(mockRequest, { params: { userId } });

            expect(mockGetServerSession).toHaveBeenCalled();
            expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
            expect(mockGetPlansByUserId).toHaveBeenCalledWith({ userId });
            expect(mockCreatePlanForUser).toHaveBeenCalledWith({ plan, userId });

            expect(response.status).toBe(201);
            const responseBody = await response.json();

            expect(responseBody.id).toBe(plan.id);
            compareBuilds({ actualBuilds: responseBody.builds, expectedBuilds: plan.builds });
            expect(responseBody._links.self.href).toBe(`${getBaseUrl()}/api/users/${userId}/plans/${planId}`);
            expect(responseBody._links.self.id).toBe(planId);
          });
        });

        describe("and the specified user already has a plan", () => {
          it("should return a 400", async () => {
            const email = uuidv4();
            const userId = uuidv4();
            const newPlan = generatePlan({ planId: uuidv4(), userId });
            const existingPlan = generatePlan({ planId: uuidv4(), userId });

            mockGetServerSession.mockReturnValue({ user: { email } });
            const user: User = { email, id: userId };
            mockGetUserById.mockReturnValue(user);
            mockGetPlansByUserId.mockReturnValue([existingPlan]);

            const mockRequest: NextRequest = {
              json: async () => newPlan,
              url: `${getBaseUrl()}/api/users/${userId}/plans`,
            } as NextRequest;
            const response = await POST(mockRequest, { params: { userId } });

            expect(mockGetServerSession).toHaveBeenCalled();
            expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
            expect(mockGetPlansByUserId).toHaveBeenCalledWith({ userId });
            expect(mockCreatePlanForUser).not.toHaveBeenCalled();

            expect(response.status).toBe(400);
          });
        });
      });

      describe("and does not match the current session", () => {
        it("should return a 403", async () => {
          const email = uuidv4();
          const userId = uuidv4();
          const plan = generatePlan({ planId: uuidv4(), userId });

          mockGetServerSession.mockReturnValue({ user: { email: uuidv4() } });
          const user: User = { email, id: userId };
          mockGetUserById.mockReturnValue(user);

          const mockRequest: NextRequest = {
            json: async () => plan,
            url: `${getBaseUrl()}/api/users/${userId}/plans`,
          } as NextRequest;
          const response = await POST(mockRequest, { params: { userId } });

          expect(mockGetServerSession).toHaveBeenCalled();
          expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
          expect(mockGetPlansByUserId).not.toHaveBeenCalled();
          expect(mockCreatePlanForUser).not.toHaveBeenCalled();

          expect(response.status).toBe(403);
        });
      });
    });

    describe("when the specified user does not exist", () => {
      it("should return a 403", async () => {
        const email = uuidv4();
        const userId = uuidv4();
        const plan = generatePlan({ planId: uuidv4(), userId });

        mockGetServerSession.mockReturnValue({ user: { email } });
        mockGetUserById.mockReturnValue(undefined);

        const mockRequest: NextRequest = {
          json: async () => plan,
          url: `${getBaseUrl()}/api/users/${userId}/plans`,
        } as NextRequest;
        const response = await POST(mockRequest, { params: { userId } });

        expect(mockGetServerSession).toHaveBeenCalled();
        expect(mockGetUserById).toHaveBeenCalledWith({ id: userId });
        expect(mockGetPlansByUserId).not.toHaveBeenCalled();
        expect(mockCreatePlanForUser).not.toHaveBeenCalled();

        expect(response.status).toBe(403);
      });
    });
  });
});
