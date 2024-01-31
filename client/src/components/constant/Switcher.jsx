import { Switch } from "antd";
import PropTypes from "prop-types";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import LightModeIcon from "@mui/icons-material/LightMode";

function Switcher({ isDarkTheme, toggleTheme }) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Switch
        checked={isDarkTheme}
        checkedChildren={
          <Brightness3Icon
            className="text-gray-300 mb-[1px]"
            style={{ fontSize: 16, transform: "rotate(20deg)" }}
          />
        }
        unCheckedChildren={
          <LightModeIcon className="text-yellow-500" style={{ fontSize: 16 }} />
        }
        onChange={toggleTheme}
        style={{
          backgroundColor: isDarkTheme ? "#2C3E50" : "#ECF0F1",
          borderColor: isDarkTheme ? "#2C3E50" : "#ECF0F1",
        }}
      />
    </div>
  );
}

Switcher.propTypes = {
  isDarkTheme: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Switcher;
