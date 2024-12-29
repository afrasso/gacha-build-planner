"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGenshinDataContext } from "@/contexts/genshin/GenshinDataContext";
import { Build } from "@/types";

interface SortableBuildProps {
  build: Build;
}

const SortableBuild = ({ build }: SortableBuildProps) => {
  const { getCharacter } = useGenshinDataContext();

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: build.characterId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const character = getCharacter(build.characterId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col items-center justify-center p-2 bg-background border rounded-md cursor-move w-20 h-20"
    >
      <Image alt={character.name} className="rounded-full mb-1" height={40} src={character.iconUrl} width={40} />
      <span className="text-xs text-center truncate w-full">{character.name}</span>
    </div>
  );
};

interface ReorderBuildsDialogProps {
  builds: Build[];
  isOpen: boolean;
  onClose: () => void;
  onReorder: (newOrder: Build[]) => void;
}

export function ReorderBuildsDialog({ builds, isOpen, onClose, onReorder }: ReorderBuildsDialogProps) {
  const [items, setItems] = useState<Build[]>([]);

  useEffect(() => {
    setItems(builds);
  }, [builds]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over?.id && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.characterId === active.id);
        const newIndex = items.findIndex((item) => item.characterId === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    onReorder(items);
    onClose();
  };

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Reorder Builds</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px] w-full pr-4">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext items={items.map((build) => build.characterId)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-6 gap-4">
                {items.map((build) => (
                  <SortableBuild build={build} key={build.characterId} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </ScrollArea>
        <Button className="mt-4" onClick={handleSave}>
          Save Order
        </Button>
      </DialogContent>
    </Dialog>
  );
}
