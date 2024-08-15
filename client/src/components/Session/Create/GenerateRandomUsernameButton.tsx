export default (Props: any) => {
  const { setup } = Props;
  return (
    <div>
      <button
        disabled={setup.isGeneratorDisabled}
        className="inputBg text-[22.5px] grid justify-center items-center rounded-[10px]"
        onClick={setup.generateRandomUsername}
      >
        
        <i className={setup.IconRef} />
      </button>
    </div>
  );
};
