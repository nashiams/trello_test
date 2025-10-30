"use client";

export const Navbar = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <nav className="bg-[#1d2125] border-b border-[#2c333a] px-6 py-3">
      <h1
        onClick={handleRefresh}
        className="text-[18px] font-normal text-white cursor-pointer hover:text-gray-300 transition-colors"
      >
        Trello Kanban Board
      </h1>
    </nav>
  );
};
