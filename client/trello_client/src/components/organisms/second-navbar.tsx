"use client";

import { useState } from "react";

export const BoardNavbar = () => {
  const [boardName, setBoardName] = useState("My Kanban Board");
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      {isEditing ? (
        <input
          type="text"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-[15px] font-bold text-white bg-transparent border-none outline-none focus:outline-none"
          style={{ fontFamily: "Inter Tight" }}
          autoFocus
        />
      ) : (
        <h2
          onClick={handleClick}
          className="text-[15px] font-bold text-white cursor-pointer hover:text-gray-200 transition-colors"
          style={{ fontFamily: "Inter Tight" }}
        >
          {boardName}
        </h2>
      )}
    </div>
  );
};
