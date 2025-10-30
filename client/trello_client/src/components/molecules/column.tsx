// molecule/column.tsx

"use client";

import { useState } from "react";
import { TaskCard } from "./task-card";
import { TaskModal } from "./task-modal";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { Minus, Plus } from "lucide-react";
import type { Task } from "../../store/task-store";

type ColumnProps = {
  title: string;
  bgColor: string;
  tasks: Task[];
  status: "To Do" | "In Progress" | "Done";
};

const DraggableTaskCard = ({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id, // Use number ID directly
      data: {
        task: task,
        status: task.status,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="mb-2"
    >
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
};

export const Column = ({ title, bgColor, tasks, status }: ColumnProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      status: status,
    },
  });

  const handleAddCard = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Log for debugging
  console.log(`Column "${status}" - isOver: ${isOver}, tasks: ${tasks.length}`);

  return (
    <>
      <div
        className="flex flex-col min-w-[280px] max-w-[280px] rounded-xl"
        style={{ backgroundColor: bgColor }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <h2 className="text-[14px] font-medium text-white">{title}</h2>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/60 hover:text-white hover:bg-white/10 rounded p-1 transition-all"
          >
            {isMinimized ? (
              <Plus className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
          </button>
        </div>

        {!isMinimized && (
          <div
            ref={setNodeRef}
            className={`px-3 pb-3 flex flex-col flex-1 min-h-[400px] transition-colors ${
              isOver ? "bg-white/5" : ""
            }`}
            data-status={status}
          >
            <div className="flex-1">
              {tasks.map((task) => (
                <DraggableTaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleCardClick(task)}
                />
              ))}
            </div>

            <button
              onClick={handleAddCard}
              className="w-full text-left px-3 py-2 rounded-lg text-[14px] text-gray-300 hover:bg-white/10 transition-colors mt-2"
            >
              + Add a card
            </button>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
      />
    </>
  );
};
