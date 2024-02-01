import moment from "moment";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Dropdown from "../components/user/Dropdown";
import { DeleteOutlined } from "@ant-design/icons";
import { List, Button, Card, Checkbox, Modal } from "antd";
import { Fragment, useEffect, useState } from "react";
import { getList, deleteList, taskStatus } from "../api/services/userService";
import { hideLoading, showLoading } from "../utils/alertSlice";

const MyList = () => {
  const dispatch = useDispatch();
  const [lists, setLists] = useState([]);

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

  return (
    <Fragment>
      <div className="flex justify-start p-4">
        <Dropdown />
      </div>
      <div className="container mx-auto pt-10 p-4">
        <h1 className="text-3xl font-bold text-pine-green mb-4 text-center">
          My List
        </h1>
        <List
          grid={{ gutter: 16, column: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
          dataSource={lists}
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
                  <div key={taskIndex} className="flex items-center">
                    <Checkbox
                      checked={task.completed}
                      onChange={() => handleCheckboxChange(item._id, task._id)}
                    />
                    <div className="flex ml-3">
                      <p>{moment(task.time).format("h:mm a")} - </p>
                      <strong className="capitalize ml-2">{task.title}</strong>
                    </div>
                  </div>
                ))}
              </Card>
            </List.Item>
          )}
        />
      </div>
    </Fragment>
  );
};

export default MyList;
