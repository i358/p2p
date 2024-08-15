export default (Props: any) => {
  const { setup } = Props;
  return (
    <div
      className="p-[8px_14px] pb-[0]"
      id="inputBoxContainer"
    >
      <div ref={setup.emailRef} className="inputBg grid grid-cols-[auto,1fr] items-center gap-[13px] rounded-[10px] h-[max-content] w-[100%] border-none p-[15px_15px]">
        <i className="fa-regular fa-envelope text-[20px]" />
        <input
          type="email"
          value={setup.email}
          ref={setup.emailRef}
          className="w-[100%] placeholder-[#52586dd6] bg-[transparent]"
          placeholder="user@example.com"
          onKeyDown={setup.handleKey}
          onChange={setup.handleEmailChange}
        />
      </div>
    </div>
  );
};
