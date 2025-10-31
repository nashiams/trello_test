"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Column } from "../molecules/column";
import { useTaskStore, type Task } from "../../store/task-store";

export const Board = () => {
  const { tasks, isLoading, fetchTasks, updateTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id;

    let task: Task | null = null;
    for (const status in tasks) {
      const foundTask = tasks[status].find(
        (t) =>
          t.id === taskId ||
          t.id === parseInt(taskId.toString()) ||
          t.id.toString() === taskId.toString()
      );
      if (foundTask) {
        task = foundTask;
        break;
      }
    }

    setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id as "To Do" | "In Progress" | "Done";

    let currentTask: Task | null = null;
    let currentStatus: string | null = null;
    for (const status in tasks) {
      const foundTask = tasks[status].find(
        (t) =>
          t.id === taskId ||
          t.id === parseInt(taskId.toString()) ||
          t.id.toString() === taskId.toString()
      );
      if (foundTask) {
        currentTask = foundTask;
        currentStatus = status;
        break;
      }
    }

    if (!currentTask || currentStatus === newStatus) return;

    // Use store's updateTask for optimistic update
    await updateTask(currentTask.id, { status: newStatus });
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
      <div className="w-2/3 p-4">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <div className="flex gap-3 items-start">
            <Column
              title="To Do"
              bgColor="#543669"
              tasks={tasks["To Do"] || []}
              status="To Do"
            />
            <Column
              title="In Progress"
              bgColor="#664629"
              tasks={tasks["In Progress"] || []}
              status="In Progress"
            />
            <Column
              title="Done"
              bgColor="#2d5932"
              tasks={tasks["Done"] || []}
              status="Done"
            />
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="opacity-80 rotate-3">
                <div className="bg-[#22272b] rounded-lg p-3 border border-[#2c333a] shadow-xl">
                  <h3 className="text-[14px] font-normal text-white mb-2">
                    {activeTask.title}
                  </h3>
                  {activeTask.description && (
                    <p className="text-[12px] text-gray-400">
                      {activeTask.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};
