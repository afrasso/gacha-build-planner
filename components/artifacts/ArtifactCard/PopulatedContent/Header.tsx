import { Info, Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import ArtifactEditor from "@/components/artifacts/ArtifactEditor";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDataContext } from "@/contexts/DataContext";
import { ArtifactData } from "@/types";

interface HeaderProps {
  artifact: ArtifactData;
  artifactTypeKey: string;
  characterId?: string;
  onUpdate?: (artifact: ArtifactData) => void;
  showInfoButton: boolean;
  showMetrics: boolean;
  size?: "large" | "small";
}

const Header: React.FC<HeaderProps> = ({
  artifact,
  artifactTypeKey,
  onUpdate,
  showInfoButton = true,
  size = "small",
}) => {
  const headerMargin = size === "large" ? "mb-4" : "mb-0";
  const textSize2 = size === "large" ? "text-base" : "text-xs";

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const update = (artifact: ArtifactData) => {
    onUpdate?.(artifact);
    setIsDialogOpen(false);
  };

  const { resolvePath } = useDataContext();

  return (
    <div className={`flex justify-between items-center ${headerMargin}`}>
      <div className="flex">
        <div className={`w-6 h-8 ${!onUpdate && !showInfoButton && "invisible"}`} />
        <div className={`w-6 h-8 ${(!onUpdate || !showInfoButton) && "invisible"}`} />
      </div>
      <p className={`${textSize2} text-muted-foreground mb-1 text-center`}>{artifactTypeKey}</p>
      <div className="flex">
        {onUpdate ? (
          <>
            {/* This overlay blocks background clicks, since the having modal={true} is broken in Firefox. See
            https://github.com/radix-ui/primitives/issues/2390. It can be deleted once that issue is solved. */}
            {isDialogOpen && <div aria-hidden="true" className="fixed inset-0 bg-black/50 z-40" />}

            {/* Note that modal is set to false here. Once the issue above is fixed this can be removed. */}
            <Dialog key={artifactTypeKey} modal={false} onOpenChange={setIsDialogOpen} open={isDialogOpen}>
              <DialogTrigger asChild>
                <Button className="p-0 w-6 h-8 flex-shrink-0" size="sm" variant="ghost">
                  <Pencil size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[425px]"
                // This prevents the dialog from closing when they click the overlay. Not needed when the modal flag is
                // removed once the fix above is available.
                onInteractOutside={(event) => {
                  event.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle>Edit {artifactTypeKey} Artifact</DialogTitle>
                </DialogHeader>
                <ArtifactEditor artifactTypeKey={artifactTypeKey} onUpdate={update} />
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="p-0 w-6 h-8 flex-shrink-0 invisible"></div>
        )}
        {showInfoButton ? (
          <Button asChild className="p-0 w-6 h-8 flex-shrink-0" size="sm" variant="ghost">
            <Link href={resolvePath(`/artifacts/${artifact.id}`)}>
              <Info size={16} />
            </Link>
          </Button>
        ) : (
          <div className="p-0 w-6 h-8 flex-shrink-0 invisible"></div>
        )}
      </div>
    </div>
  );
};

export default Header;
