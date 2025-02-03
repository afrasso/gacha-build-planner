export interface MenuContent {
  description: string;
  href: string;
  key: string;
  subMenuContents?: MenuContent[];
  title: string;
}

export const menuContents: MenuContent[] = [
  {
    description: "Manage your Genshin Impact builds and artifacts.",
    href: "/genshin",
    key: "genshin",
    subMenuContents: [
      {
        description: "Identify and prioritize key targets for your character builds.",
        href: "/genshin/builds",
        key: "builds",
        title: "Builds",
      },
      {
        description: "Curate and refine your artifact collection.",
        href: "/genshin/artifacts",
        key: "artifacts",
        title: "Artifacts",
      },
      {
        description: "Import your game data, or import and/or export your character builds and artifacts.",
        href: "/genshin/importexport",
        key: "importexport",
        title: "Import/Export",
      },
    ],
    title: "Genshin Impact",
  },
  {
    description: "Manage your Honkai: Star Rail builds and artifacts.",
    href: "/starrail",
    key: "starrail",
    subMenuContents: [
      {
        description: "Identify and prioritize key targets for your character builds.",
        href: "/starrail/builds",
        key: "builds",
        title: "Builds",
      },
      {
        description: "Curate and refine your artifact collection.",
        href: "/starrail/artifacts",
        key: "artifacts",
        title: "Artifacts",
      },
      {
        description: "Import your game data, or import and/or export your character builds and artifacts.",
        href: "/starrail/importexport",
        key: "importexport",
        title: "Import/Export",
      },
    ],
    title: "Honkai: Star Rail",
  },
];
