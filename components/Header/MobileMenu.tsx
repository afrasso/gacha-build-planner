import { LogIn, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";

import { MenuContent } from "./MenuContent";

interface MobileMenuProps {
  isLoggedIn: boolean;
  menuContents: MenuContent[];
  onLogin: () => void;
  onLogout: () => void;
  user?: {
    avatar: string;
    email: string;
    name: string;
  };
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isLoggedIn, menuContents, onLogin, onLogout, user }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col bg-background border-b divide-y border-t overflow-y-auto">
      {menuContents.map((menuContent) => (
        <div key={menuContent.key} className="flex flex-col divide-y">
          <Button className="text-md font-semibold h-14" onClick={() => router.push(menuContent.href)} variant="ghost">
            {menuContent.title}
          </Button>
          {menuContent.subMenuContents &&
            menuContent.subMenuContents.map((subMenuContent) => (
              <Button
                className="text-md h-12"
                onClick={() => router.push(subMenuContent.href)}
                key={subMenuContent.key}
                variant="ghost"
              >
                {subMenuContent.title}
              </Button>
            ))}
        </div>
      ))}
      <div className="flex flex-col divide-y">
        <span className="text-md font-semibold h-14 flex items-center justify-center">Account</span>
        {isLoggedIn ? (
          <>
            <Button className="w-full text-md h-12" onClick={() => router.push("/profile")} variant="ghost">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button className="w-full text-md h-12" onClick={() => router.push("/settings")} variant="ghost">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button className="w-full text-md h-12" onClick={onLogout} variant="ghost">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </>
        ) : (
          <Button className="w-full text-md h-12" onClick={onLogin} variant="ghost">
            <LogIn className="mr-2 h-4 w-4" />
            Log in
          </Button>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
