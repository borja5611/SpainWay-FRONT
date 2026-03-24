import roseAvatar from "@/assets/chat/RoseAvatar.png";

export default function ChatAvatar() {
  return (
    <div className="h-[48px] w-[48px] overflow-hidden rounded-full bg-neutral-200">
      <img
        src={roseAvatar}
        alt="Rose"
        className="h-full w-full object-cover"
      />
    </div>
  );
}