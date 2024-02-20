import { useState } from "react";
import { IconStar } from "../../../components/icon";
import FormComment from "../FormComment";

function ReviewsComment() {
  const [showFormReply, setShowFormReply] = useState<boolean>(false);

  const handleCloseForm = () => {
    setShowFormReply(false);
  };

  return (
    <div className="w-full mt-5">
      <div className="flex items-start gap-x-2 ">
        <img alt="" srcSet="/user.png" className="w-[25px] rounded-full" />
        <div className="flex flex-col w-full gap-y-3">
          <div className="w-full bg-grayF5 px-[15px] py-[2px]">
            <h3 className="text-sm font-bold">User name</h3>
            <div className="flex justify-start my-2 text-orange">
              {Array(5)
                .fill(0)
                .map((_, index) => {
                  return <IconStar key={index} size={15}></IconStar>;
                })}
            </div>
            <div className="leading-6">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse
              ipsum et adipisci aliquam debitis recusandae error, voluptates
              consequuntur! Sit, mollitia repellat tempora cupiditate quas ab
              possimus porro consequuntur reiciendis hic!
            </div>
            <span
              onClick={() => {
                setShowFormReply(true);
              }}
              className="text-xs cursor-pointer text-blue"
            >
              Trả lời
            </span>
          </div>
          {showFormReply && (
            <FormComment
              type="comment"
              handleCloseForm={handleCloseForm}
            ></FormComment>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewsComment;
