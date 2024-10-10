import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Task1 from "./Task1/Fuel";
import Task2 from "./Task2/Form";

function App() {
  const [showNav, setShowNav] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Hiển thị điều hướng nếu đang ở trang chính ("/")
    if (location.pathname === "/") {
      setShowNav(true);
    } else {
      setShowNav(false);
    }
  }, [location]);

  return (
    <div>
      {showNav && (
        <nav>
          <ul className="flex items-center justify-center h-screen mx-auto space-x-20">
            <li className="font-bold text-justify">
              <Link to="/task1">TASK 1</Link>
            </li>
            <li className="font-bold text-justify">
              <Link to="/task2">TASK 2</Link>
            </li>
          </ul>
        </nav>
      )}

      <Routes>
        <Route path="/task1" element={<Task1 />} />
        <Route path="/task2" element={<Task2 />} />
      </Routes>
    </div>
  );
}

export default App;
