import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Dropdown from "../components/user/Dropdown";
import { Fragment, useEffect, useState } from "react";
import { hideLoading, showLoading } from "../utils/alertSlice";
import { getUser, insertList } from "../api/services/userService";
import {
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Form,
  List,
  Input,
  Button,
  Checkbox,
  DatePicker,
  TimePicker,
} from "antd";

const Home = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
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
      setTasks([...tasks, { task: newTask, time: taskTime, completed: false }]);
      setNewTask("");
      setTaskTime(null);
    }
  };

  const removeTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleCheckboxChange = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const [editIndex, setEditIndex] = useState(null);

  const startEditing = (index) => {
    setNewTask(tasks[index].task);
    setTaskTime(tasks[index].time);
    setEditIndex(index);
  };

  const cancelEditing = () => {
    setNewTask("");
    setTaskTime(null);
    setEditIndex(null);
  };

  const updateTask = () => {
    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = {
        task: newTask,
        time: taskTime,
        completed: updatedTasks[editIndex].completed,
      };
      setTasks(updatedTasks);
      cancelEditing();
    }
  };

  const onFinish = async () => {
    try {
      dispatch(showLoading());
      const list = tasks.map((task) => ({
        title: task.task,
        time: task.time,
        completed: task.completed,
      }));
      const date = form.getFieldValue("date");
      const formData = { date, list };
      const response = await insertList(formData);
      dispatch(hideLoading());
      if (response.data.success) {
        const newList = response.data.data;
        setTasks([...tasks, newList]);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Fragment>
      <div className="flex justify-start p-4">
        <Dropdown />
      </div>
      <div className="max-w-xl mx-auto pt-10 p-4">
        <h1 className="text-3xl font-bold text-pine-green mb-2 text-center">
          Todo List
        </h1>
        <div className="flex justify-center mb-4">
          <DatePicker
            placeholder="Select Date"
            format="YYYY-MM-DD"
            onChange={(date) => form.setFieldsValue({ date })}
          />
        </div>
        <Form form={form} onFinish={onFinish}>
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
              shape="circle"
              onClick={addTask}
              icon={<PlusOutlined />}
            ></Button>
          </div>
          <div>
            <List
              dataSource={tasks}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Checkbox
                      key={index + 1}
                      className="mr-3"
                      checked={item.completed}
                      onChange={() => handleCheckboxChange(index)}
                    />,
                    <Button
                      key={index + 1}
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => removeTask(index)}
                    />,
                    editIndex === null ? (
                      <Button
                        key={index + 1}
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => startEditing(index)}
                      />
                    ) : null,
                  ]}
                  className="border-b capitalize"
                >
                  {editIndex === index ? (
                    <Fragment>
                      <TimePicker
                        format="h:mm a"
                        value={taskTime}
                        onChange={(time) => setTaskTime(time)}
                        className="mr-2"
                      />
                      <Input
                        placeholder="Edit Task"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onPressEnter={updateTask}
                        className="mr-2"
                      />
                      <Button
                        shape="circle"
                        className="mr-1"
                        onClick={updateTask}
                        icon={<CheckOutlined />}
                      ></Button>
                      <Button
                        shape="circle"
                        onClick={cancelEditing}
                        icon={<CloseOutlined />}
                      ></Button>
                    </Fragment>
                  ) : (
                    <Fragment>
                      {item.time && item.time.format("h:mm A")} - {item.task}
                    </Fragment>
                  )}
                </List.Item>
              )}
            />
          </div>
          <div className="mt-4 flex justify-center">
            <Button size="large" className="bg-pine-green w-full" htmlType="submit">
              Submit List
            </Button>
          </div>
        </Form>
      </div>
    </Fragment>
  );
};

export default Home;
