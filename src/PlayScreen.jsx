import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";
import gsap from "gsap";
import { useEffect } from "react";
import {
  useRive,
  Alignment,
  Fit,
  Layout,
  useStateMachineInput,
} from "@rive-app/react-canvas";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function PlayScreen({ end, difficulty }) {
  // Code for rive animation
  const { rive, RiveComponent } = useRive({
    src: "/character.riv",
    stateMachines: "character",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Fill,
      alignment: Alignment.TopCenter,
    }),
  });

  const xAxisInp = useStateMachineInput(rive, "character", "xAxis");
  const yAxisInp = useStateMachineInput(rive, "character", "yAxis");
  const missInp = useStateMachineInput(rive, "character", "onMiss");
  const correctInp = useStateMachineInput(rive, "character", "onCorrect");

  useEffect(() => {
    window.addEventListener("mousemove", (e) => {
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight;

      if (yAxisInp) {
        yAxisInp.value = (e.clientY / maxHeight) * 80;
        xAxisInp.value = (e.clientX / maxWidth) * 80;
      }
    });
  }, [yAxisInp]);

  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [lives, setLives] = useState(null);
  //   This is created to control the animation of the hearts when they pop
  const [lives2, setLives2] = useState(null);

  // This state sets the win or lose of the player
  const [winLose, setWinLose] = useState(null);

  // This state controls the timer
  const [timer, setTimer] = useState(null);

  // This useEffect controls the timer
  useEffect(() => {
    let interval;
    if (timer && timer > 0 && !winLose) {
      interval = setInterval(() => {
        setTimer((prevTime) => {
          return prevTime - 1;
        });
      }, 1000);
    } else if (timer === 0) {
      setWinLose("lose");
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  useEffect(() => {
    if (difficulty === "Medium") {
      setLives(10);
      setLives2(10);
      setTimer(105);
    }
    if (difficulty === "Hard") {
      setLives(7);
      setLives2(7);
      setTimer(75);
    }

    if (difficulty === "Easy") {
      setTimer(120);
    }
  }, []);

  //   This useEffect checks whether the player is still in the game or not
  useEffect(() => {
    if (lives2 == 0) {
      setWinLose("lose");
    }
  }, [lives2]);

  const hearts = Array.from({ length: lives }, (content, idx) => {
    return icons.GiHearts;
  }).map((Heart, idx) => {
    return <Heart key={idx} className="text-[red] heart"></Heart>;
  });

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 200,
        });
        newState = "matched";
        if (correctInp) {
          correctInp.fire();
        }
      }

      //   If the choice is wrong, pop a heart
      if (
        alreadyFlippedTile.content !== justFlippedTile.content &&
        difficulty !== "Easy"
      ) {
        const heartEls = gsap.utils.toArray(".heart");
        gsap.to(heartEls[lives2 - 1], {
          scale: 2,
          opacity: 0,
        });

        setLives2(lives2 - 1);
      }

      // if the choice is wrong, fire animation
      if (alreadyFlippedTile.content !== justFlippedTile.content) {
        if (missInp) {
          missInp.fire();
        }
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setWinLose("win");
          }

          return newTiles;
        });
      }, 500);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  function newGame() {
    setTimeout(end, 0);
  }
  //   This useEffect animates the tiles in on mount
  useEffect(() => {
    // const allTiles = document.querySelectorAll(".tile-cont");
    const allTiles = gsap.utils.toArray(".tile-cont");

    allTiles.forEach((tile) => {
      let num = Math.floor(Math.random() * (700 - 400 + 1)) + 100;

      tile.style.cssText = `transform: translate(${
        num % 2 == 1 ? -num : num
      }px, ${num % 3 == 1 ? -num : num}px);
        opacity: 0;
        `;
    });

    // This function randomises the sequence with which the tiles come into view
    function translateTiles() {
      let numTiles = allTiles.length;
      let numTilesArr = [];
      let randomTilesEls = [];

      //   This for loop helps to create an array of numbers 1 to 16 put in a random order
      for (let i = 0; i < numTiles; i++) {
        let randomTile = Math.floor(Math.random() * 16) + 1;

        // If a number is already in the array, generate a new number till its not in the array.
        while (numTilesArr.includes(randomTile)) {
          randomTile = Math.floor(Math.random() * 16) + 1;
        }

        // Updating the 2 arrays
        numTilesArr.push(randomTile);
        randomTilesEls.push(allTiles[randomTile - 1]);

        // By the time the lengths of the array are equal, call the gsap animation
        if (randomTilesEls.length === numTiles) {
          gsap.to(randomTilesEls, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.inOut",
          });
        }
      }
    }

    let ctx = gsap.context(() => {
      gsap.timeline().fromTo(
        ".all-tiles-cont",
        {
          scaleY: 0,
          transformOrigin: "center",
        },
        {
          scaleY: 1,
          ease: "power3.in",
          duration: 0.5,
          onComplete: translateTiles,
        }
      );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <>
      <RiveComponent className="fixed top-0 left-0 w-full h-full -1024:opacity-0 -1024:pointer-events-none -1024:scale-0" />

      {}
      <div
        className={`${
          winLose ? "opacity-1" : "opacity-0"
        } pointer-events-none fixed w-full h-full bg-overlay z-40`}
      ></div>
      <div
        className={`${
          winLose
            ? "opacity-1 pointer-events-all active"
            : "pointer-events-none opacity-0 "
        } rounded-xl winLoseModal  w-80 p-4 flex flex-col justify-between shadow fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-20%] z-[50]  ${
          winLose == "win"
            ? "text-[#595BEF] bg-[#EEF2FF]"
            : "bg-[red] text-white"
        }`}
      >
        <div className="py-4">
          <h2 className="font-bold text-3xl text-center">
            {winLose == "win" ? "You Won!" : "Oops, you Lost."}
          </h2>
          <p className="my-2 text-center">
            {winLose == "win"
              ? `You won the game with ${
                  lives2 ? `${lives2} lives left,` : ""
                } ${tryCount} tries and ${timer} seconds to spare!`
              : timer == 0
              ? "You ran out of time!. Click on the button to start a new game"
              : "You ran out of lives. Click on the button to start a new game"}
          </p>
        </div>
        <button
          onClick={newGame}
          className={`${
            winLose == "win" ? "bg-[#A5B4FD] text-white" : "bg-white text-[red]"
          } py-2 px-4  ease-in-out font-[500]  text-xl rounded-2xl shadow`}
        >
          New Game
        </button>
      </div>

      <div className="min-h-[100vh] max-w-[500px] mx-auto w-full flex flex-col gap-10 justify-center items-center p-3 -1024:scale-[0.8] -400:scale-[0.7] relative">
        <div className="flex gap-3 items-center justify-center text-2xl font-[500] w-full relative">
          <p className="text-[#595BEF]">Tries</p>
          <div className="bg-[#C7D2FF] px-3 rounded-lg text-[#595BEF]">
            {tryCount}
          </div>
          <div className="absolute top-[-40px] right-[-40px]">
            <p className="text-3xl font-[600] text-[#595BEF]">
              {`${Math.floor(timer / 60)}`.padStart(2, 0)}:
              {`${timer % 60}`.padStart(2, 0)}
            </p>
          </div>
        </div>

        <div className="all-tiles-cont grid grid-cols-[repeat(4,_minmax(80px,_80px))] items-center justify-center justify-items-center gap-6 bg-[#EEF2FF] p-4 rounded-xl relative">
          {getTiles(16).map((tile, i) => (
            <Tile key={i} flip={() => flip(i)} {...tile} />
          ))}
        </div>
        {difficulty !== "Easy" ? (
          <div className="flex items-center gap-2 text-xl text-[#595BEF] font-[700] ">
            <p>Lives({lives2}):</p>
            <div className="flex">{hearts}</div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xl text-[#595BEF] font-[700]">
            <p>Lives: Unlimited</p>
          </div>
        )}
      </div>
    </>
  );
}
