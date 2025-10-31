"use client";

import { useState, useEffect } from "react";

import { Circle, CheckCircle2, AlignLeft, Clock } from "lucide-react";
import { Dialog, DialogContent } from "../atoms/dialog";
import { Button } from "../atoms/button";
import { Label } from "../atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/select";
import { useTaskStore, type Task } from "../../store/task-store";

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
};

export const TaskModal = ({ isOpen, onClose, task }: TaskModalProps) => {
  const { createTask, updateTask, deleteTask } = useTaskStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"To Do" | "In Progress" | "Done">(
    "To Do"
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setIsEditingTitle(false);
      setIsEditingDescription(false);
    } else {
      setTitle("");
      setDescription("");
      setStatus("To Do");
      setIsEditingTitle(true);
      setIsEditingDescription(false);
    }
  }, [task, isOpen]);

  const handleSave = async () => {
    if (!title.trim()) return;

    if (task) {
      await updateTask(task.id, { title, description, status });
    } else {
      await createTask(title, description);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (task) {
      await deleteTask(task.id);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTitleBlur = async () => {
    setIsEditingTitle(false);
    if (task && title !== task.title && title.trim()) {
      await updateTask(task.id, { title });
    }
  };

  const handleDescriptionBlur = async () => {
    setIsEditingDescription(false);
    if (task && description !== task.description) {
      await updateTask(task.id, { description });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#282e33] border-[#3c444c] text-white max-w-5xl w-[90vw] p-0 gap-0">
        <div className="flex h-[500px]">
          {/* Left side - Main content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Title with checkbox */}
            <div className="flex items-start gap-3 mb-6">
              <div className="mt-1">
                {status === "Done" ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTitleBlur();
                    }}
                    className="text-[20px] font-medium text-white bg-transparent border-none outline-none focus:outline-none w-full"
                    style={{ fontFamily: "Inter Tight" }}
                    placeholder="Enter task title"
                    autoFocus
                  />
                ) : (
                  <h2
                    onClick={() => setIsEditingTitle(true)}
                    className="text-[20px] font-medium text-white cursor-pointer hover:bg-white/5 px-2 py-1 -mx-2 rounded"
                    style={{ fontFamily: "Inter Tight" }}
                  >
                    {title || "Untitled"}
                  </h2>
                )}
                <p className="text-[12px] text-gray-400 mt-1 px-2">
                  in list <span className="underline">{status}</span>
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <AlignLeft className="w-5 h-5 text-gray-400" />
                <h3 className="text-[14px] font-medium text-white">
                  Description
                </h3>
              </div>
              <div className="ml-7">
                {isEditingDescription ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={handleDescriptionBlur}
                    className="w-full bg-[#22272b] border border-[#3c444c] text-white text-[14px] rounded-lg p-3 min-h-[120px] outline-none focus:border-[#0079bf]"
                    placeholder="Add a more detailed description..."
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => setIsEditingDescription(true)}
                    className="w-full bg-[#22272b] hover:bg-[#2c333a] border border-transparent hover:border-[#3c444c] text-[14px] rounded-lg p-3 min-h-[120px] cursor-pointer transition-colors"
                  >
                    {description ? (
                      <p className="text-white whitespace-pre-wrap">
                        {description}
                      </p>
                    ) : (
                      <p className="text-gray-500">
                        Add a more detailed description...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Timestamps */}
            {task && (
              <div className="ml-7 space-y-2">
                <div className="flex items-center gap-2 text-[12px] text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Created: {formatDate(task.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Updated: {formatDate(task.updatedAt)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar - Actions */}
          <div className="w-[200px] bg-[#22272b] p-4 border-l border-[#3c444c]">
            <div className="space-y-6">
              <div>
                <h4 className="text-[12px] font-medium text-gray-400 mb-2 uppercase">
                  Add to card
                </h4>
                <div className="space-y-2">
                  <div>
                    <Label
                      htmlFor="status"
                      className="text-[12px] text-gray-300 mb-1 block"
                    >
                      Status
                    </Label>
                    <Select
                      value={status}
                      onValueChange={(value: any) => setStatus(value)}
                    >
                      <SelectTrigger className="bg-[#282e33] border-[#3c444c] text-white text-[13px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#282e33] border-[#3c444c] text-white">
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[12px] font-medium text-gray-400 mb-2 uppercase">
                  Actions
                </h4>
                <div className="space-y-2">
                  <Button
                    onClick={handleSave}
                    className="w-full bg-[#0079bf] hover:bg-[#026aa7] text-white text-[13px] h-8"
                  >
                    Save
                  </Button>
                  {task && (
                    <Button
                      onClick={handleDelete}
                      variant="destructive"
                      className="w-full text-[13px] h-8"
                    >
                      Delete
                    </Button>
                  )}
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full bg-transparent border-[#3c444c] text-white hover:bg-[#2c333a] text-[13px] h-8"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
