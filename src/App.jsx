import { useEffect, useState } from "react";
import { PlayScreen } from "./PlayScreen";
import { StartScreen } from "./StartScreen";
import Difficulty from "./Difficulty";
import gsap from "gsap";
import { Transition, runTransition } from "./Transition";

function App() {
  const [gameState, setGameState] = useState("start");
  const [difficulty, setDifficulty] = useState("");

  function moveCard() {
    gsap
      .timeline()
      .to(".play-screen-slider", {
        xPercent: -110,
        duration: 0.5,
      })
      .from(".difficulty", {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 0.6,
        ease: "power3.inOut",
      });
  }

  useEffect(() => {
    gsap.set(".home", {
      opacity: 0,
      y: 100,
    });

    runTransition("pink", () => {
      gsap.to(".home", {
        opacity: 1,
        y: 0,
      });
    });
  }, []);

  switch (gameState) {
    case "start":
      return (
        <>
          <Transition />
          <div className="w-full max-w-[500px] opacity-0 home mx-auto min-h-[100vh] flex justify-center items-center relative overflow-hidden -1024:scale-[0.8] -400:scale-[0.7]">
            <div className="play-screen-slider w-full flex justify-center items-center">
              <div className=" h-full w-full absolute flex justify-center items-center gap-6 flex-col">
                <StartScreen start={() => moveCard()} />
              </div>

              <div className="w-full h-[500px] absolute translate-x-[110%] flex flex-col gap-4 items-center justify-center bg-[#FDF3F8] rounded-xl">
                <h2 className="difficulty text-4xl font-[600] mb-8 text-[#E4458F]">
                  Select Difficulty
                </h2>
                <Difficulty
                  difficulty="Easy"
                  modeDescrip1={"-Unlimited Lives"}
                  modeDescrip2={"-Timer at 2:00"}
                  play={() => {
                    setGameState("play");
                    setDifficulty("Easy");
                  }}
                />
                <Difficulty
                  difficulty="Medium"
                  modeDescrip1={`-Limited Lives(10)`}
                  modeDescrip2={`-Timer at 1:45`}
                  play={() => {
                    setGameState("play");
                    setDifficulty("Medium");
                  }}
                />
                <Difficulty
                  difficulty="Hard"
                  modeDescrip1={`-Limited Lives(6)`}
                  modeDescrip2={`-Timer at 1:15`}
                  play={() => {
                    setGameState("play");
                    setDifficulty("Hard");
                  }}
                />
              </div>
            </div>
          </div>
        </>
      );
    case "play":
      return (
        <>
          <Transition />
          <PlayScreen
            end={() => setGameState("start")}
            difficulty={difficulty}
          />
        </>
      );
    default:
      throw new Error("Invalid game state " + gameState);
  }
}

export default App;
