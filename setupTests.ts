import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@/components/ui/button", () => import("./__mocks__/components/ui/button"));
vi.mock("@/components/ui/label", () => import("./__mocks__/components/ui/label"));
vi.mock("@/components/ui/select", () => import("./__mocks__/components/ui/select"));
vi.mock("lucide-react", () => import("./__mocks__/lucide-react"));
