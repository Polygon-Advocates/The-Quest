import { CircleLoader } from "react-spinners";

const LoadingComponent = () => {
  return (
    <main className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="bg-black w-28 h-28 flex items-center justify-center">
        <CircleLoader color="#36d7b7" />
      </div>
    </main>
  );
};

export default LoadingComponent;
