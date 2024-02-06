import moment from "moment";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userPath } from "../routes/routeConfig";
import Dropdown from "../components/user/Dropdown";
import { Fragment, useEffect, useState } from "react";
import { hideLoading, showLoading } from "../utils/alertSlice";
import { getList, getUser, insertList } from "../api/services/userService";
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
  Radio,
  Input,
  Button,
  Checkbox,
  DatePicker,
  TimePicker,
} from "antd";

const Home = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskTime, setTaskTime] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [includeTime, setIncludeTime] = useState(true);
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
    if (newTask.trim() !== "") {
      if (includeTime && taskTime !== null) {
        setTasks([
          ...tasks,
          {
            task: newTask,
            time: taskTime,
            completed: false,
          },
        ]);
      } else if (!includeTime) {
        setTasks([
          ...tasks,
          {
            task: newTask,
            time: null,
            completed: false,
          },
        ]);
      } else {
        toast.error("Please Select Time");
        return;
      }
      setNewTask("");
      setTaskTime(null);
    }
  };

  const handleIncludeTimeChange = (e) => {
    setIncludeTime(e.target.value);
    setTaskTime(null);
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

  useEffect(() => {
    fetchListCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchListCount = async () => {
    try {
      const response = await getList();
      if (response.data.success) {
        const count = response.data.data.length;
        const data = response.data.data;
        let defaultName = `List ${count + 1}`;
        setName(defaultName);
        setList(data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const onFinish = async () => {
    try {
      if (tasks.length === 0) {
        toast.error("Add at least one task");
        return;
      }
      dispatch(showLoading());
      const list = tasks.map((task) => ({
        title: task.task,
        time: task.time,
        completed: task.completed,
      }));
      let date = form.getFieldValue("date");
      if (!date) {
        date = moment();
        form.setFieldsValue({ date });
      }
      const formattedDate = date.format("YYYY-MM-DD");
      const formData = { name, date: formattedDate, list };
      const response = await insertList(formData);
      dispatch(hideLoading());
      if (response.data.success) {
        form.resetFields();
        toast.success(response.data.message);
        navigate(userPath.list);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const disabledDate = (current) => {
    const formattedCurrent = current.format("YYYY-MM-DD");
    const isInPast = current.isBefore(moment(), "day");
    const isDateInList = list.some(
      (task) =>
        task.date && moment(task.date).format("YYYY-MM-DD") === formattedCurrent
    );
    return isInPast || isDateInList;
  };

  return (
    <Fragment>
      <div className="fixed top-4 left-4 z-50">
        <Dropdown />
      </div>
      <div className="max-w-xl mx-auto pt-10 p-4">
        <h1 className="text-3xl font-bold text-pine-green mb-2 text-center">
          Todo List
        </h1>
        <div className="flex justify-center mb-4 gap-x-4">
          <DatePicker
            placeholder="Select Date"
            format="YYYY-MM-DD"
            onChange={(date) => form.setFieldsValue({ date })}
            disabledDate={disabledDate}
          />
          <Radio.Group
            value={includeTime}
            disabled={tasks.length > 0}
            onChange={handleIncludeTimeChange}
          >
            <Radio.Button value={true}>Timed</Radio.Button>
            <Radio.Button value={false}>Untimed</Radio.Button>
          </Radio.Group>
        </div>
        <Form form={form} onFinish={onFinish}>
          <div className="flex items-center justify-center mb-4">
            <TimePicker
              format="h:mm a"
              value={taskTime}
              onChange={(time) => setTaskTime(time)}
              className="mr-2 py-2"
              disabled={!includeTime}
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
                  className="border-b"
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
                    <div>
                      {item.time && item.time.format("h:mm a") + ` - `}
                      <span className="capitalize font-semibold">
                        {item.task}
                      </span>
                    </div>
                  )}
                </List.Item>
              )}
            />
          </div>
          <div className="mt-4 flex justify-center">
            <Button
              size="large"
              className="bg-pine-green w-full"
              htmlType="submit"
              disabled={tasks.length === 0}
            >
              Submit List
            </Button>
          </div>
        </Form>
      </div>
    </Fragment>
  );
};

export default Home;
