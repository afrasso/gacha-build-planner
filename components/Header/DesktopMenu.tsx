import React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import ListItem from "./ListItem";
import { MenuContent } from "./MenuContent";

interface DesktopMenuProps {
  menuContents: MenuContent[];
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({ menuContents }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menuContents.map((menuContent) => (
          <NavigationMenuItem key={menuContent.key}>
            <NavigationMenuTrigger>{menuContent.title}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href={menuContent.href}
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">{menuContent.title}</div>
                      <p className="text-sm leading-tight text-muted-foreground">{menuContent.description}</p>
                    </a>
                  </NavigationMenuLink>
                </li>
                {menuContent.subMenuContents &&
                  menuContent.subMenuContents.map((subMenuContent) => (
                    <ListItem href={subMenuContent.href} key={subMenuContent.key} title={subMenuContent.title}>
                      {subMenuContent.description}
                    </ListItem>
                  ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopMenu;
