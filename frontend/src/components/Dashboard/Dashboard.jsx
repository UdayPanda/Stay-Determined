import { useState } from "react";
import "../../App.css"
import Navbar from "./Navbar";
import TodoGraph from "./TodoGraph";
import AllTodos from "./AllTodos";
import AddTodo from "./AddTodo";
import VitaminM from "./VitaminM";
import Search from "./Search";
import { ExpanseProvider } from "../../contexts/ExpanseContext";
import Premium from "./Premium";
import Plans from "./Plans";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [stateDisplay, setStateDisplay] = useState("dashboard");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const renderContent = () => {
    switch (stateDisplay) {
      case "dashboard":
        return  <TodoGraph />;
      case "allTodos":
        return <AllTodos />;
      case "addTodo":
        return <AddTodo />;
      case "plans":
        return <Plans />;
      case "vitaminm":
        return (
          <ExpanseProvider>
            <VitaminM />
          </ExpanseProvider>
        );

      case "premium":
        return <Premium />;
      default:
        return <TodoGraph />;
    }
  };

  return (
    <>
      <Navbar />
      <Search />
      <div className="absolute left-5 lg:left-32 top-16 lg:top-24">
        <div>
          <div className="burger-icon" onClick={toggleMenu}>
            <div className={`line ${isOpen ? "open" : ""}`}></div>
            <div className={`line ${isOpen ? "open" : ""}`}></div>
            <div className={`line ${isOpen ? "open" : ""}`}></div>
          </div>
          <nav className={`menu ${isOpen ? "open" : ""}`}>
            <ul>
              <li
                className={`${active === "dashboard" ? "bg-[#1f2937] text-[#e5e7eb]" : ""} cursor-pointer p-2 rounded-md hover:bg-slate-300 hover:text-[#1f2937]`}
                onClick={() => {setStateDisplay("dashboard"); setActive("dashboard")}}
              >
                Dashboard
              </li>
              <li
                className={`${active === "alltodos" ? "bg-[#1f2937] text-[#e5e7eb]" : ""} cursor-pointer p-2 rounded-md hover:bg-slate-300 hover:text-[#1f2937]`}
                onClick={() => {setStateDisplay("allTodos"); setActive("alltodos")}}
              >
                All Todos
              </li>
              <li
                className={`${active === "addtodo" ? "bg-[#1f2937] text-[#e5e7eb]" : ""} cursor-pointer p-2 rounded-md hover:bg-slate-300 hover:text-[#1f2937]`}
                onClick={() => {setStateDisplay("addTodo"); setActive("addtodo")}}
              >
                Add Todo
              </li>
              <li
                className={`${active === "plans" ? "bg-[#1f2937] text-[#e5e7eb]" : ""} cursor-pointer p-2 rounded-md hover:bg-slate-300 hover:text-[#1f2937]`}
                onClick={() => {setStateDisplay("plans"); setActive("plans")}}
              >
                Plans
              </li>
              <li
                className={`${active === "vitaminm" ? "bg-[#1f2937] text-[#e5e7eb]" : ""} cursor-pointer p-2 rounded-md hover:bg-slate-300 hover:text-[#1f2937]`}
                onClick={() => {setStateDisplay("vitaminm"); setActive("vitaminm")}}
              >
                VitaminM
              </li>
              <li
                className={`${active === "premium" ? "bg-[#1f2937] text-[#e5e7eb]" : ""} cursor-pointer p-2 rounded-md hover:bg-slate-300 hover:text-[#1f2937]`}
                onClick={() => {setStateDisplay("premium"); setActive("premium")}}
              >
                Premium
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div
        className={`pt-24 font-poppins min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-8`}
      >
        {renderContent()}
      </div>
    </>
  );
}

export default Dashboard;
