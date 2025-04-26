import { useState } from "react";

import ArtifactEditor from "@/components/artifacts/ArtifactEditor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArtifactData } from "@/types";

interface PlaceholderContentProps {
  artifactTypeKey: string;
  onUpdate: (artifact: ArtifactData) => void;
}

const PlaceholderContent: React.FC<PlaceholderContentProps> = ({ artifactTypeKey, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* This overlay blocks background clicks, since the having modal={true} is broken in Firefox. See 
      https://github.com/radix-ui/primitives/issues/2390. It can be deleted once that issue is solved. */}
      {isDialogOpen && <div aria-hidden="true" className="fixed inset-0 bg-black/50 z-40" />}

      {/* Note that modal is set to false here. Once the issue above is fixed this can be removed. */}
      <Dialog key={artifactTypeKey} modal={false} onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <DialogTrigger>
          <div className="w-16 h-16 bg-muted rounded-full mb-2 flex items-center justify-center">
            <span className="text-2xl text-muted-foreground">+</span>
          </div>
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
            <DialogTitle>Add {artifactTypeKey} Artifact</DialogTitle>
          </DialogHeader>
          <ArtifactEditor artifactTypeKey={artifactTypeKey} onUpdate={onUpdate} />
        </DialogContent>
      </Dialog>
      <p className="text-sm font-medium">{artifactTypeKey}</p>
      <p className="text-xs text-muted-foreground">Click to add</p>
    </div>
  );
};

export default PlaceholderContent;
