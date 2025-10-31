"use client";

export const Navbar = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <nav className="bg-[#1d2125] border-b border-[#2c333a] px-8 py-3">
      <div
        onClick={handleRefresh}
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <img
          src="https://cdn.simpleicons.org/trello/949492"
          alt="Trello"
          className="w-5 h-5"
        />
        <h1
          className="text-[16px] font-regular text-[#949492]"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Trillili
        </h1>
      </div>
    </nav>
  );
};
