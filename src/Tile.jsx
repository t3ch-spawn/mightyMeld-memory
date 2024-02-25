import gsap from "gsap";
import { useEffect } from "react";

export function Tile({ content: Content, flip, state }) {

  return (
    <div className="flex flex-col w-full h-[80px] relative tile-cont">
      {/* // case "start": */}
      <Back
        className={` ${state === "flipped" ? "active z-20" : "z-10"} ${
          state === "matched" ? "hidden" : "block"
        } tile inline-block h-full w-full bg-[#A5B4FD] text-center rounded-xl cursor-pointer absolute`}
        flip={flip}
      />
      {/* // case "flipped": */}
      <Front
        className={`${state === "flipped" ? "active z-20" : ""} ${
          state === "matched" ? "hidden" : "block"
        }  front-tile h-full w-full bg-[#6466F1] text-white rounded-xl cursor-pointer flex items-center justify-center absolute`}
      >
        <Content
          style={{
            display: "inline-block",
            width: "80%",
            height: "80%",
            verticalAlign: "top",
          }}
        />
      </Front>
      {/* // case "matched": */}
      <Matched
        className={`flex justify-center items-center h-full w-full text-[#C7D2FF] absolute duration-[600ms] ${
          state === "matched" ? "opacity-1" : "opacity-0"
        }`}
      >
        <Content
          style={{
            display: "inline-block",
            width: "80%",
            height: "80%",
            verticalAlign: "top",
          }}
        />
      </Matched>
    </div>
  );
}

function Back({ className, flip }) {
  return <div onClick={flip} className={className}></div>;
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}
