import React from "react";

const ConversationSkeleton = ({ count }) => {
  const skeletons = Array(count).fill(0);
  return (
    <div>
      {skeletons.map((_, index) => (
        <div key={index} className="flex w-52 flex-col gap-4 mt-2 ml-2">
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-md"></div>
            <div className="flex flex-col gap-4">
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-4 w-40"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationSkeleton;
