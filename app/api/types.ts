import { Build } from "@/types";

export interface Link {
  href: string;
  id?: string;
}

export interface Plan {
  _links: Record<string, Link>;
  builds: Build[];
  id: string;
}

export interface User {
  _links: Record<string, Link>;
  email: string;
  id: string;
}
