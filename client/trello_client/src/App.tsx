import { Board } from "./components/organisms/board";
import { Navbar } from "./components/organisms/navbar";
import { BoardNavbar } from "./components/organisms/second-navbar";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-[#1d2125]">
      <Navbar />
      <div className="flex-1 relative">
        <BoardNavbar />
        <Board />
      </div>
    </div>
  );
}
