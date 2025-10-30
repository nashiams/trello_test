// File: client/trello_client/src/components/organisms/board.tsx
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
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

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

  const addDebug = (message: string) => {
    console.log(`[DND Debug] ${message}`);
    setDebugInfo((prev) => [
      ...prev.slice(-4),
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const taskId = event.active.id;
    addDebug(`Drag Start - Task ID: ${taskId} (type: ${typeof taskId})`);

    // Try to find the task - check if ID needs parsing
    let task = null;
    for (const status in tasks) {
      // Try both number and string comparison
      task = tasks[status].find(
        (t) =>
          t.id === taskId ||
          t.id === parseInt(taskId.toString()) ||
          t.id.toString() === taskId.toString()
      );
      if (task) {
        addDebug(`Found task "${task.title}" in status "${status}"`);
        break;
      }
    }

    if (!task) {
      addDebug(`ERROR: Could not find task with ID ${taskId}`);
    }

    setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    addDebug(`Drag End - Active: ${active?.id}, Over: ${over?.id}`);

    setActiveTask(null);

    if (!over) {
      addDebug("No drop target - cancelled");
      return;
    }

    const taskId = active.id;
    const newStatus = over.id as "To Do" | "In Progress" | "Done";

    addDebug(`Attempting to move task ${taskId} to "${newStatus}"`);

    // Find current task with flexible ID matching
    let currentTask = null;
    let currentStatus = null;
    for (const status in tasks) {
      const task = tasks[status].find(
        (t) =>
          t.id === taskId ||
          t.id === parseInt(taskId.toString()) ||
          t.id.toString() === taskId.toString()
      );
      if (task) {
        currentTask = task;
        currentStatus = status;
        break;
      }
    }

    if (!currentTask) {
      addDebug(`ERROR: Task ${taskId} not found in any column`);
      return;
    }

    addDebug(
      `Found task "${currentTask.title}" in "${currentStatus}", moving to "${newStatus}"`
    );

    // Check if status actually changed
    if (currentStatus === newStatus) {
      addDebug("Same column - no update needed");
      return;
    }

    // Try to update
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_URL || "http://localhost:3000"
      }/api/tasks/${currentTask.id}`;
      addDebug(`Making API call to: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const responseText = await response.text();
      addDebug(
        `API Response: ${response.status} - ${responseText.substring(0, 100)}`
      );

      if (response.ok) {
        addDebug("Update successful - refreshing tasks");
        await fetchTasks();
      } else {
        addDebug(`API Error: ${response.status} - ${responseText}`);
      }
    } catch (error) {
      addDebug(`Network Error: ${error}`);
      console.error("Failed to update task:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-white text-[14px]">Loading...</p>
      </div>
    );
  }

  // Debug panel
  const DebugPanel = () => (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg max-w-md z-50">
      <div className="text-xs font-mono">
        <div className="font-bold mb-2">🐛 Drag & Drop Debug:</div>
        {debugInfo.length === 0 ? (
          <div className="text-gray-400">Waiting for drag events...</div>
        ) : (
          debugInfo.map((info, idx) => (
            <div key={idx} className="text-green-400 mb-1">
              {info}
            </div>
          ))
        )}
        <div className="mt-2 text-yellow-400">
          Tasks loaded: {Object.values(tasks).flat().length} total
        </div>
        <div className="text-blue-400">Check console for detailed logs</div>
      </div>
    </div>
  );

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
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <div className="flex gap-4 items-start">
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

      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
};
