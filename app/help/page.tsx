import type { Metadata } from "next";

import HelpContent from "@/components/help/HelpContent";
import { getHelpMessages } from "@/constants/messages";

const help = getHelpMessages();

export const metadata: Metadata = {
  description: "Learn how artifact metrics work and how to use the Gacha Build Planner.",
  title: help.title,
};

export default function HelpPage() {
  return (
    <main>
      <HelpContent />
    </main>
  );
}
