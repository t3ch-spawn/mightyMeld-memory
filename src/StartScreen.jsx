export function StartScreen({ start }) {
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-[70px] py-[100px] px-3 rounded-xl w-full bg-[#FDF3F8] text-center">
        <h2 className="font-[700] text-5xl text-[#EC4899]">Memory</h2>
        <p className="text-[#EC4899] font-[500] text-2xl">
          Flip over tiles looking for pairs
        </p>
        <button
          onClick={() => {
            start();
          }}
          className="rounded-[100px] w-[95%] max-w-[200px] bg-[#E4458F] text-white p-3 px-6 text-2xl font-[500] play-btn"
        >
          Play
        </button>
      </div>
      <h2 className="text-[#EC4899] text-xl text-center font-[500] hidden -1024:block">
        For the best experience, please play on a laptop screen
      </h2>
    </>
  );
}
