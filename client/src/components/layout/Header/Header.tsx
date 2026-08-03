import { FaPlus } from "react-icons/fa";
import { useAppDispatch } from "@store/reduxHooks";
import { openForm } from "@store/features/ui/uiSlice";

import "./Header.scss";

const Header = () => {
  const dispatch = useAppDispatch();

  const handleCreateTask = () => {
    dispatch(openForm());
  };

  return (
    <header className="header">
      <div className="header-left">
      </div>

      <div className="header-right">
        <button className="header-create-btn" onClick={handleCreateTask}>
          <FaPlus /> Создать задачу
        </button>
      </div>
    </header>
  );
};

export default Header;
