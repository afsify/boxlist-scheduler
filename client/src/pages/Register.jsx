import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Button, Form, Input } from "antd";
import { userPath } from "../routes/routeConfig";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import { sendOTP } from "../api/services/userService";
import { hideLoading, showLoading } from "../utils/alertSlice";

function Register() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await sendOTP(values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(userPath.registerOTP, { state: { user: response.data.user } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const validatePassword = (_, value) => {
    const passwordFieldValue = form.getFieldValue("password");
    if (passwordFieldValue === value) {
      return Promise.resolve();
    }
    return Promise.reject("Passwords do not match");
  };

  return (
    <AuthCard>
      <h2 className="font-bold text-3xl text-pine-green">Register</h2>
      <p className="text-sm mt-3 text-pine-green">
        Create your free account and get started
      </p>
      <Form className="flex flex-col mt-3" onFinish={onFinish} form={form}>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter your name",
            },
            {
              pattern: /^(?=.*[A-Za-z])[\s\S]*$/,
              message: "Name cannot be empty",
            },
          ]}
        >
          <Input placeholder="Name" className="p-2" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email",
              type: "email",
            },
          ]}
        >
          <Input placeholder="Email" className="p-2" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Need 8-20 characters, one symbol & number",
              pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).{8,20}$/,
            },
          ]}
        >
          <Input.Password placeholder="Password" className="p-2" />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password",
              validator: validatePassword,
            },
          ]}
        >
          <Input.Password placeholder="Confirm Password" className="p-2" />
        </Form.Item>
        <Button
          size="large"
          className="bg-pine-green font-semibold hover:scale-105 duration-300"
          htmlType="submit"
        >
          Register
        </Button>
      </Form>
      <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
        <hr className="border-gray-400" />
        <p className="text-center text-sm">OR</p>
        <hr className="border-gray-400" />
      </div>
      <div className="mt-5 text-sm flex justify-center items-center text-pine-green">
        <p>Already have an account?</p>
        <Link
          to={userPath.login}
          className="pl-1 text-blue-900 font-semibold hover:text-blue-500 hover:underline"
        >
          Login
        </Link>
      </div>
    </AuthCard>
  );
}

export default Register;
