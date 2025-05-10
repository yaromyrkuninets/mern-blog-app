import { Button } from "flowbite-react";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-[#4B5320] justify-center items-center rounded-tl-3xl rounded-br-3xl text-center bg-white dark:bg-gray-900">
      <div className="flex-1 justify-center flex flex-col">
        <h2 className="text-2xl text-[#4B5320] font-semibold">
          Stay Informed — Stay Ready
        </h2>
        <p className="text-gray-600 dark:text-gray-400 my-2">
          Explore key military insights, tactics, and field strategies shaping
          modern defense.
        </p>
        <Button className="mt-2 bg-gradient-to-r from-[#4B5320] via-[#556B2F] to-[#8B8C7A] text-white rounded-tl-xl rounded-bl-none px-4 py-2">
          <a href="/search" rel="noopener noreferrer">
            Browse Military Posts
          </a>
        </Button>
      </div>
      <div className="p-7 flex-1">
        <img
          src="https://militarnyi.com/wp-content/uploads/2022/03/foto-1.jpg"
          alt="Military image"
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default CallToAction;
