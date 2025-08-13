import { auth } from "../../firebase";
import LinkOrSpan from "./linkorspan";

const Message = ({ item }) => {
  // eğer mesajı aktif kullanıcı attıysa:
  if (item.author.id === auth.currentUser.uid) {
    return (
      <p className="bg-black text-white self-end message rounded-[7px_7px_0_7px]">
        {" "}
        <LinkOrSpan text={item.text} />
      </p>
    );
  }

  // eğer başka kullanıcı attıysa:
  return (
    <div className="flex items-start gap-1">
      <img src={item.author.photo} alt={item.author.name} className="size-[40px] rounded-full" />

      <div className="flex flex-col gap-1 w-full">
        <span className="font-semibold whitespace-nowrap text-zinc-700">{item.author.name}</span>
        <p className="message text-zinc-800 bg-zinc-200 rounded-[0_7px_7px_7px]">
          <LinkOrSpan text={item.text} />
        </p>
      </div>
    </div>
  );
};

export default Message;
