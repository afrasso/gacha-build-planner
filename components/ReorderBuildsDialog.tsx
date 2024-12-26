"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Build } from "@/types";

interface SortableBuildProps {
  build: Build;
}

const SortableBuild = ({ build }: SortableBuildProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: build.character.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex flex-col items-center justify-center p-2 bg-background border rounded-md cursor-move w-20 h-20"
    >
      <Image
        src={build.character.iconUrl}
        alt={build.character.name}
        width={40}
        height={40}
        className="rounded-full mb-1"
      />
      <span className="text-xs text-center truncate w-full">{build.character.name}</span>
    </div>
  );
};

interface ReorderBuildsDialogProps {
  builds: Build[];
  onReorder: (newOrder: Build[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ReorderBuildsDialog({ builds, onReorder, isOpen, onClose }: ReorderBuildsDialogProps) {
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.character.id === active.id);
        const newIndex = items.findIndex((item) => item.character.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    onReorder(items);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Reorder Builds</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px] w-full pr-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((build) => build.character.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-6 gap-4">
                {items.map((build) => (
                  <SortableBuild key={build.character.id} build={build} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </ScrollArea>
        <Button onClick={handleSave} className="mt-4">
          Save Order
        </Button>
      </DialogContent>
    </Dialog>
  );
}
