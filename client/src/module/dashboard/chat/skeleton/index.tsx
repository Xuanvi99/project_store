function SkeletonConversation() {
  return (
    <div>
      <aside className="flex w-full h-full overflow-hidden bg-white rounded-lg basis-1/3">
        <div className="flex flex-col w-full p-3 gap-y-2">
          <div className="flex items-center gap-x-3">
            <p className="text-xl font-semibold">Danh sách tin nhắn</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default SkeletonConversation;
