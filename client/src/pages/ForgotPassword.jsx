import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Button, Form, Input } from "antd";
import { userPath } from "../routes/routeConfig";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import { forgotPassword } from "../api/services/userService";
import { showLoading, hideLoading } from "../utils/alertSlice";

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await forgotPassword(values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(userPath.resetOTP, { state: { email: response.data.email } });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <AuthCard>
      <h2 className="font-bold text-3xl text-pine-green">Forgot Password</h2>
      <p className="text-sm mt-3 text-pine-green">
        Enter email to reset your password
      </p>
      <Form className="flex flex-col mt-3" onFinish={onFinish}>
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
        <Button
          size="large"
          className="bg-pine-green font-semibold hover:scale-105 duration-300"
          htmlType="submit"
        >
          Submit
        </Button>
      </Form>
      <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
        <hr className="border-gray-400" />
        <p className="text-center text-sm">OR</p>
        <hr className="border-gray-400" />
      </div>
      <div className="mt-3 text-sm flex justify-center items-center text-pine-green py-4">
        <p>Don&apos;t have an account?</p>
        <Link
          to={userPath.register}
          className="pl-1 text-blue-900 font-semibold hover:text-blue-500 hover:underline"
        >
          Register
        </Link>
      </div>
    </AuthCard>
  );
}

export default ForgotPassword;
