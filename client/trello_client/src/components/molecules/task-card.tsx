"use client";

import { useState } from "react";
import { X, Circle, CheckCircle2 } from "lucide-react";
import { useTaskStore, type Task } from "../../store/task-store";

type TaskCardProps = {
  task: Task;
  onClick: () => void;
  onDelete: () => void;
  onMarkDone: () => void;
};

export const TaskCard = ({
  task,
  onClick,
  onDelete,
  onMarkDone,
}: TaskCardProps) => {
  const { deleteTask, updateTask } = useTaskStore();
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteTask(task.id);
    onDelete();
  };

  const handleMarkDone = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await updateTask(task.id, { status: "Done" });
    onMarkDone();
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-[#22272b] hover:bg-[#2c333a] rounded-lg p-3 cursor-pointer transition-all border border-[#2c333a] relative group"
    >
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <X className="w-4 h-4 text-red-500 hover:text-red-400" />
      </button>

      <div className="flex items-start gap-2">
        <div className="shrink-0 mt-0.5 w-4 h-4">
          {isHovered && task.status !== "Done" && (
            <button
              onClick={handleMarkDone}
              className="hover:scale-110 transition-all duration-200 ease-in-out"
            >
              <Circle className="w-4 h-4 text-gray-400 hover:text-green-500 transition-colors duration-200" />
            </button>
          )}
          {isHovered && task.status === "Done" && (
            <CheckCircle2 className="w-4 h-4 text-green-500 transition-all duration-200 ease-in-out" />
          )}
        </div>
        <h3
          className={`text-[14px] font-normal text-white mb-2 pr-6 flex-1 transition-transform duration-200 ease-in-out ${
            isHovered ? "translate-x-1" : ""
          }`}
        >
          {task.title}
        </h3>
      </div>

      {task.description && (
        <p className="text-[12px] text-gray-400 mb-2 ml-4">
          {task.description}
        </p>
      )}
      <div className="flex flex-col gap-1 ml-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500">Status:</span>
          <span className="text-[11px] text-gray-300">{task.status}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500">Created:</span>
          <span className="text-[11px] text-gray-300">
            {formatDate(task.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};
