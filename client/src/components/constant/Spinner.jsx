import { useSelector } from "react-redux";

function Spinner() {
  const { loading } = useSelector((state) => state.alerts);

  return loading ? (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="relative h-24 w-24">
        <div className="rounded-full h-24 w-24 border-t-4 border-t-pine-green animate-spin absolute"></div>
        <div className="h-full w-full flex justify-center items-center">
          <div className=" animate-ping mt-2">
            <div className="inline-block w-6 h-6 bg-pine-green rounded-sm mx-1"></div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default Spinner;
