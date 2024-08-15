

export default (Props: any) => {
  return (
    <div className="p-[15px_14px] pb-[0] pt-[10px] grid items-center">
      <button
        onClick={Props.data.checkIsFormAvailable}
        id="subButton"
        disabled={Props.data.isDisabled}
        type="submit"
        className="p-[15px_14px] color-[#d9d9dae0] font-[401] text-[18px] w-[100%] rounded-[10px]"
      >
        
        Flight to Chat  
               
         {" "}{" "}{" "}
        
        <i className="fa-regular fa-plane bg-[transparent!important]" />

      </button>
    </div>
  );
};
 