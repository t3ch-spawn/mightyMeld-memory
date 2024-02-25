import React, { useState } from "react";

export default function Difficulty(props) {
  function toggleModal(e) {
    const currModal = e.currentTarget.parentElement.previousSibling;
    currModal.classList.toggle("active");
  }

  return (
    <>
      <div
        className={`bg-white  modal opacity-0 pointer-events-none rounded w-80 p-4 flex flex-col justify-between z-20 shadow-xl fixed left-[45%] top-[20%] translate-x-[-50%] translate-y-[0%] duration-200`}
      >
        <div className="py-4">
          <h2 className="font-bold text-xl">{props.difficulty} mode</h2>
          <p className="my-2">{props.modeDescrip1}</p>
          <p className="my-2">{props.modeDescrip2}</p>
        </div>
      </div>
      <div className="flex gap-4 justify-center items-center w-full difficulty">
        <button
          onClick={props.play}
          className="rounded-lg w-[70%] bg-[#E4458F] text-white p-3 px-6 text-2xl font-[500] play-btn relative"
        >
          {props.difficulty}
        </button>
        <div
          onMouseEnter={(e) => {
            toggleModal(e);
          }}
          onMouseLeave={(e) => {
            toggleModal(e);
          }}
          className="bg-white p-2 px-4 text-2xl rounded-lg font-[700] cursor-pointer"
        >
          ?
        </div>
      </div>
    </>
  );
}
