import React from "react";
import { useAtom } from "jotai";
import { appStateAtom, levelStateAtom } from "@/store/game-atoms";

import Home from "./pages/Home/Home";
import QuizScreen from "./pages/Quiz/QuizScreen/QuizScreen";
import GameFinished from "./pages/Game Finished/GameFinished";
import { WelcomeStep, Level } from "./pages/Welcome/Welcome";
import Loading from "./pages/Quiz/Loading/Loading";

function App() {
  const [appState, setAppState] = useAtom(appStateAtom);
  const [, setLevel] = useAtom(levelStateAtom);

  const handleSelectLevel = (selectedLevel: Level) => {
    setLevel(selectedLevel);
    setAppState("loading");
  };

  return (
    <div className="game-app-stage-container" style={{ width: "100%", minHeight: "100%" }}>
      {appState === "home" ? (
        <Home />
      ) : appState === "welcome" ? (
        <WelcomeStep onSelectLevel={handleSelectLevel} />
      ) : appState === "loading" ? (
        <Loading />
      ) : appState === "quiz" ? (
        <QuizScreen />
      ) : (
        <GameFinished />
      )}
    </div>
  );
}

export default App;