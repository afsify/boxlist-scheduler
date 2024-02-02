import moment from "moment";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Dropdown from "../components/user/Dropdown";
import { Fragment, useEffect, useState } from "react";
import { hideLoading, showLoading } from "../utils/alertSlice";
import {
  List,
  Card,
  Modal,
  Input,
  Button,
  Select,
  Checkbox,
  TimePicker,
} from "antd";
import {
  getList,
  editTask,
  deleteList,
  taskStatus,
  deleteTask,
  insertTask,
} from "../api/services/userService";
import {
  EditOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const MyList = () => {
  const dispatch = useDispatch();
  const [lists, setLists] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedTime, setEditedTime] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [newTaskTime, setNewTaskTime] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLists = async () => {
    try {
      dispatch(showLoading());
      const response = await getList();
      dispatch(hideLoading());
      if (response.data.success) {
        setLists(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleCheckboxChange = async (listId, taskId) => {
    try {
      const updatedLists = lists.map((list) => {
        if (list._id === listId) {
          list.list = list.list.map((task) => {
            if (task._id === taskId) {
              task.completed = !task.completed;
            }
            return task;
          });
        }
        return list;
      });
      setLists(updatedLists);
      const response = await taskStatus(listId, taskId, {
        completed: updatedLists
          .find((list) => list._id === listId)
          .list.find((task) => task._id === taskId).completed,
      });
      if (!response.data.success) {
        toast.error(response.data.message);
      }
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const startEditing = (listId, taskId, taskTitle, taskTime) => {
    setEditedTask(taskTitle);
    setEditedTime(moment(taskTime));
    setEditIndex({ listId, taskId });
  };

  const cancelEditing = () => {
    setEditedTask("");
    setEditedTime(null);
    setEditIndex(null);
  };

  const updateTask = async () => {
    if (editIndex !== null) {
      const { listId, taskId } = editIndex;
      try {
        dispatch(showLoading());
        const response = await editTask(listId, taskId, {
          title: editedTask,
          time: editedTime,
        });
        dispatch(hideLoading());

        if (response.data.success) {
          setEditIndex(null);
          fetchLists();
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.error(error);
        toast.error("Something went wrong");
      }
    }
  };

  const handleDeleteTask = async (listId, taskId) => {
    try {
      dispatch(showLoading());
      const response = await deleteTask(listId, taskId);
      dispatch(hideLoading());
      if (response.data.success) {
        fetchLists();
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

  const showDeleteTaskConfirm = (listId, taskId) => {
    Modal.confirm({
      title: "Delete Task",
      content: "Are you sure you want to delete this task?",
      okText: "Yes",
      okButtonProps: { style: { background: "#01796F" } },
      cancelText: "No",
      onOk: () => handleDeleteTask(listId, taskId),
    });
  };

  const handleInsertNewTask = async (listId) => {
    if (newTask.trim() !== "" && newTaskTime) {
      try {
        dispatch(showLoading());
        const response = await insertTask(listId, {
          title: newTask,
          time: newTaskTime,
        });
        dispatch(hideLoading());
        if (response.data.success) {
          fetchLists();
          toast.success(response.data.message);
          setNewTask("");
          setNewTaskTime(null);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.error(error);
        toast.error("Something went wrong");
      }
    }
  };

  const handleDelete = async (listId) => {
    try {
      dispatch(showLoading());
      const response = await deleteList(listId);
      dispatch(hideLoading());
      if (response.data.success) {
        const updatedLists = lists.filter((list) => list._id !== listId);
        setLists(updatedLists);
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

  const showDeleteConfirm = (listId) => {
    Modal.confirm({
      title: "Delete List",
      content: "Are you sure you want to delete this list?",
      okText: "Yes",
      okButtonProps: { style: { background: "#01796F" } },
      cancelText: "No",
      onOk: () => handleDelete(listId),
    });
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const sortedLists = lists.map((list) => ({
    ...list,
    list: [...list.list].sort((a, b) => {
      const timeA = moment(a.time);
      const timeB = moment(b.time);

      if (sortOrder === "asc") {
        return timeA - timeB;
      } else {
        return timeB - timeA;
      }
    }),
  }));

  const sortOptions = [
    { label: "Time (Asc)", value: "asc" },
    { label: "Time (Dec)", value: "dec" },
  ];

  return (
    <Fragment>
      <div className="fixed top-4 left-4 z-50">
        <Dropdown />
      </div>
      <div className="container mx-auto pt-10 p-4">
        <h1 className="text-3xl font-bold text-pine-green text-center">
          My List
        </h1>
        <div className="flex justify-center mt-3 mb-4">
          <Select
            defaultValue={sortOrder}
            style={{ width: 110 }}
            onChange={handleSort}
          >
            {sortOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
        <List
          grid={{ gutter: 16, column: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
          dataSource={sortedLists}
          renderItem={(item, index) => (
            <List.Item>
              <Card
                title={moment(item.date).format("MMMM DD, YYYY")}
                actions={[
                  <Button
                    key={index + 1}
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => showDeleteConfirm(item._id)}
                  />,
                ]}
              >
                {item.list.map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className="flex items-center border-b py-3"
                  >
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleCheckboxChange(item._id, task._id)}
                      className="mr-3"
                    />
                    <div className="flex items-center flex-grow">
                      {editIndex &&
                      editIndex.listId === item._id &&
                      editIndex.taskId === task._id ? (
                        <Fragment>
                          <TimePicker
                            format="h:mm a"
                            value={editedTime}
                            onChange={(time) => setEditedTime(time)}
                            className="mr-2"
                          />
                          <Input
                            placeholder="Edit Task"
                            value={editedTask}
                            onChange={(e) => setEditedTask(e.target.value)}
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
                        <div className="ml-3">
                          <p className="text-sm text-gray-600">
                            {moment(task.time).format("h:mm a")}
                          </p>
                          <strong className="text-lg ml-1">{task.title}</strong>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 space-x-2">
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() =>
                          showDeleteTaskConfirm(item._id, task._id)
                        }
                      />
                      {!editIndex && (
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() =>
                            startEditing(
                              item._id,
                              task._id,
                              task.title,
                              task.time
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center mt-4">
                  <TimePicker
                    format="h:mm a"
                    value={newTaskTime}
                    onChange={(time) => setNewTaskTime(time)}
                    className="mr-2"
                  />
                  <Input
                    placeholder="New Task"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    className="mr-2"
                  />
                  <Button
                    shape="circle"
                    onClick={() => handleInsertNewTask(item._id)}
                    icon={<PlusOutlined />}
                  ></Button>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </Fragment>
  );
};

export default MyList;
