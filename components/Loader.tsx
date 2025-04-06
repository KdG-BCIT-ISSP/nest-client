import { Oval } from "react-loader-spinner";

export default function Loader() {
  return (
    <div className="flex flex-col items-center p-6 pt-10">
      <Oval
        visible={true}
        height="35"
        strokeWidth={4}
        width="35"
        color="#547756"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
