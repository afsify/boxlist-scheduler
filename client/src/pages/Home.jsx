import { List, Input, Button, TimePicker } from "antd";
import Dropdown from "../components/user/Dropdown";
import { Fragment, useEffect, useState } from "react";
import { getUser } from "../api/services/userService";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskTime, setTaskTime] = useState(null);
  const logged = localStorage.getItem("userToken") !== null;

  useEffect(() => {
    if (logged) {
      const fetchUserData = async () => {
        try {
          const userResponse = await getUser();
          const encodedUserData = btoa(
            JSON.stringify(userResponse.data.userData)
          );
          localStorage.setItem("userData", encodedUserData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [logged]);

  const addTask = () => {
    if (newTask.trim() !== "" && taskTime) {
      setTasks([...tasks, { task: newTask, time: taskTime }]);
      setNewTask("");
      setTaskTime(null);
    }
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <Fragment>
      <div className="flex justify-start p-4">
        <Dropdown />
      </div>
      <div className="max-w-xl mx-auto pt-10 p-4">
        <h1 className="text-3xl font-bold text-pine-green mb-4 text-center">
          Todo List
        </h1>
        <div className="flex items-center justify-center mb-4">
          <TimePicker
            format="h:mm a"
            value={taskTime}
            onChange={(time) => setTaskTime(time)}
            className="mr-2 py-2"
          />
          <Input
            placeholder="New Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onPressEnter={addTask}
            className="mr-2 py-2"
          />
          <Button
            size="large"
            onClick={addTask}
            icon={<CheckOutlined />}
            className="bg-pine-green"
          >
            Add
          </Button>
        </div>
        <div>
          <List
            dataSource={tasks}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Button
                    key={index + 1}
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => removeTask(index)}
                  />,
                ]}
                className="border-b capitalize"
              >
                 {item.time && item.time.format("h:mm a").toUpperCase()} - {item.task}
              </List.Item>
            )}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
