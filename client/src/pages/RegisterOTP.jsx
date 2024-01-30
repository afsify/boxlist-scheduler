import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { userPath } from "../routes/routeConfig";
import AuthCard from "../components/auth/AuthCard";
import InputOTP from "../components/user/InputOTP";
import { useNavigate, useLocation } from "react-router-dom";
import { hideLoading, showLoading } from "../utils/alertSlice";
import { sendOTP, verifyOTP } from "../api/services/userService";

function RegisterOTP() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = location.state || {};
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    let interval;
    if (isResending) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      clearInterval(interval);
      setIsResending(false);
    }

    return () => clearInterval(interval);
  }, [timer, isResending]);

  const startTimer = () => {
    setTimer(60);
    setIsResending(true);
  };

  useEffect(() => {
    startTimer();
  }, []);

  const handleResendOTP = async () => {
    if (!isResending) {
      try {
        dispatch(showLoading());
        const response = await sendOTP(user);
        dispatch(hideLoading());
        if (response.data.success) {
          toast.success(response.data.message);
          startTimer();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };

  const onFinish = async () => {
    try {
      const otp = otpValues.join("");
      const values = {
        otp,
        user,
      };
      dispatch(showLoading());
      const response = await verifyOTP(values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(userPath.login);
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
      <h2 className="font-bold text-3xl text-dark-purple">Verification</h2>
      <p className="text-sm mt-3 text-dark-purple">
        OTP has been sent via email to{" "}
        <span className="font-semibold">{user?.email}</span>
      </p>
      <InputOTP
        otpValues={otpValues}
        setOtpValues={setOtpValues}
        onFinish={onFinish}
        disabled={!isResending}
      />
      <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
        <hr className="border-gray-400" />
        <p className="text-center text-sm">OR</p>
        <hr className="border-gray-400" />
      </div>
      <div className="mt-5 text-sm flex justify-center items-center text-dark-purple">
        <p>Didn&apos;t Receive OTP?</p>
        <button
          onClick={handleResendOTP}
          disabled={isResending}
          className={`pl-1 text-blue-900 pb-1 font-sans font-semibold ${
            isResending
              ? "text-gray-400 cursor-not-allowed"
              : "hover:text-blue-500 hover:underline"
          }`}
        >
          Resend {isResending && `(${timer}s)`}
        </button>
      </div>
    </AuthCard>
  );
}

export default RegisterOTP;
