"use client";

import { useState } from "react";
import { TaskCard } from "./task-card";
import { TaskModal } from "./task-modal";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Minus, Plus } from "lucide-react";
import type { Task } from "../../store/task-store";

type ColumnProps = {
  title: string;
  bgColor: string;
  tasks: Task[];
  status: "To Do" | "In Progress" | "Done";
};

const SortableTaskCard = ({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
};

export const Column = ({ title, bgColor, tasks, status }: ColumnProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const { setNodeRef } = useDroppable({
    id: status,
  });

  const handleAddCard = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        className="flex flex-col min-w-[280px] max-w-[280px] rounded-xl"
        style={{
          backgroundColor: bgColor,
        }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <h2
            className="text-[14px] font-medium text-white"
            style={{ fontFamily: "Inter Tight" }}
          >
            {title}
          </h2>
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
          <div ref={setNodeRef} className="px-3 pb-3 flex flex-col">
            <div className="space-y-2 mb-2">
              <SortableContext
                items={tasks.map((t) => t.id.toString())}
                strategy={verticalListSortingStrategy}
              >
                {tasks.map((task) => (
                  <SortableTaskCard
                    key={task.id}
                    task={task}
                    onClick={() => handleCardClick(task)}
                  />
                ))}
              </SortableContext>
            </div>

            <button
              onClick={handleAddCard}
              className="w-full text-left px-3 py-2 rounded-lg text-[14px] text-gray-300 hover:bg-white/10 transition-colors"
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
