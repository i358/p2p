import GenerateRandomUsernameButton from "./GenerateRandomUsernameButton";

export default (Props: any) => {
  const { setup } = Props;
  return (
    <div
      className="p-[8px_14px] pb-[0] flex items-center gap-[5px]"
      id="inputBoxContainer"
    >
      <div ref={setup.usernameRef} className="inputBg flex-1 grid grid-cols-[auto,1fr] items-center gap-[13px] rounded-[10px] h-[max-content] w-[100%] border-none p-[15px_15px]">
        <i className="fa-regular fa-user-circle text-[20px]" />
        <input
          type="text"
          value={setup.username}
          ref={setup.usernameRef}
          className="w-[100%] placeholder-[#52586dd6] bg-[transparent]"
          placeholder="Your beautiful (?) username."
          onKeyDown={setup.handleKey}
          onChange={setup.handleUsernameChange}
        />
      </div>
      <GenerateRandomUsernameButton
      setup={{
        IconRef:setup.IconRef,
        isGeneratorDisabled:setup.isGeneratorDisabled,
        generateRandomUsername:setup.generateRandomUsername
      }}
      />
    </div>
  );
};
