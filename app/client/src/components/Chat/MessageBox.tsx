export default (Props: any) => {
  
  const { Setup } = Props;
  const handleChange = (e:any) => {
    Setup.updateTextBox(e)
  }
 
  return (
    <div
      className={`text-[17px] rounded-[20px] bg-[#1c1c26] flex flex-row items-center justify-center p-[6px_0] gap-[5px]`}
    >
      <div
              className="text-[#535365] hover:text-[white] transition-[1s] hover:transition-[1s] hover:cursor-pointer text-[30px] ml-[17px]"><i className="fa-solid fa-circle-plus" /></div>
      <textarea
        ref={Setup.messageRef}
        onChange={handleChange}
        onKeyDown={Setup.checkMessage}
        placeholder={`Send message as ${Setup.User.username}.`}
        className="w-[100%] flex-1 text-[#d2d2d2] placeholder-[#535365] resize-none max-h-[25vh] rounded-[20px] bg-[transparent] p-[0rem_.7rem] h-[1.7rem]"
      />
    </div>
  );
};