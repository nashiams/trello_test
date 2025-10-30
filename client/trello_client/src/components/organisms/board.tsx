"use client";

import { useEffect } from "react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { Column } from "../molecules/column";
import { useTaskStore } from "../../store/task-store";

const columnConfig = [
  { title: "To Do", status: "To Do" as const, bgColor: "#543669" },
  { title: "In Progress", status: "In Progress" as const, bgColor: "#664629" },
  { title: "Done", status: "Done" as const, bgColor: "#2d5932" },
];

export const Board = () => {
  const { tasks, isLoading, fetchTasks, updateTask } = useTaskStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = parseInt(active.id.toString());
    const newStatus = over.id as "To Do" | "In Progress" | "Done";

    // Find the task
    let task;
    for (const status in tasks) {
      task = tasks[status].find((t) => t.id === taskId);
      if (task) break;
    }

    if (task && task.status !== newStatus) {
      updateTask(taskId, { status: newStatus });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white text-[14px]">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-auto pt-[60px]"
      style={{
        backgroundImage:
          "url(https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/6d8514b8-1f42-47e9-b676-7a86b36dfe9d/generated_images/majestic-mountain-landscape-background-w-ea91d4c1-20251029182923.jpg)",
      }}
    >
      <div className="w-2/3 p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4">
            {/* tambah column atau ubah warna column di array columnConfig */}
            {columnConfig.map((config) => (
              <Column
                key={config.status}
                title={config.title}
                bgColor={config.bgColor}
                tasks={tasks[config.status] || []}
                status={config.status}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  );
};
