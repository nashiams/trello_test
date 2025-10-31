// File: client/trello_client/src/components/molecules/task-card.tsx

"use client";

import { X, Circle, CheckCircle2 } from "lucide-react";
import { useTaskStore, type Task } from "../../store/task-store";
import { useState, useRef } from "react";

type TaskCardProps = {
  task: Task;
  onClick: () => void;
};

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const { deleteTask, updateTask } = useTaskStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await deleteTask(task.id);
  };

  const handleMarkDone = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (task.status !== "Done") {
      await updateTask(task.id, { status: "Done" });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const deltaX = Math.abs(e.clientX - dragStartPos.current.x);
    const deltaY = Math.abs(e.clientY - dragStartPos.current.y);
    if (deltaX > 5 || deltaY > 5) {
      setIsDragging(true);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#22272b] rounded-lg p-3 transition-all border border-[#2c333a] relative group cursor-grab"
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      >
        <X className="w-4 h-4 text-red-500 hover:text-red-400" />
      </button>

      <div className="flex items-start gap-2">
        {/* Circle button - appears after title animation with delay */}
        <div className="shrink-0 mt-1 w-5">
          {isHovered && task.status !== "Done" && (
            <button
              onClick={handleMarkDone}
              className="hover:scale-110 transition-all duration-300 animate-in fade-in slide-in-from-left-2"
              style={{
                animationDelay: "200ms",
                animationDuration: "400ms",
                animationFillMode: "backwards",
              }}
            >
              <Circle className="w-5 h-5 text-gray-400 hover:text-green-500 transition-colors duration-300" />
            </button>
          )}
          {isHovered && task.status === "Done" && (
            <CheckCircle2
              className="w-5 h-5 text-green-500 animate-in fade-in slide-in-from-left-2"
              style={{
                animationDelay: "200ms",
                animationDuration: "400ms",
                animationFillMode: "backwards",
              }}
            />
          )}
        </div>

        {/* Title - moves right on hover first */}
        <div className="flex-1">
          <h3
            className={`text-[16px] font-medium text-white mb-2 pr-6 transition-transform duration-300 ease-out ${
              isHovered ? "translate-x-2" : ""
            }`}
          >
            {task.title}
          </h3>

          {/* Status and Date on same line */}
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Status:</span>
              <span className="text-gray-300">{task.status}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Created:</span>
              <span className="text-gray-300">
                {formatDate(task.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
