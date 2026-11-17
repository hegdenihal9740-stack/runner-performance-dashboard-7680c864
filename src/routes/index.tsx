import { createFileRoute } from "@tanstack/react-router";
import ManagerSite from "@/components/site/ManagerSite";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Manager — AI-powered Business Operating System" },
      {
        name: "description",
        content:
          "The Manager is an AI-powered business operating system from DevOps Manager LLP, unifying sales, inventory, HR, finance and operations.",
      },
      { property: "og:title", content: "The Manager — AI-powered Business Operating System" },
      {
        property: "og:description",
        content:
          "One unified platform for sales, inventory, HR, finance and operations — every module in sync.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ManagerSite,
});
