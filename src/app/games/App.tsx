import { useAtomValue } from "jotai";
import { appStateAtom } from "../../store/atoms";

import Home from "./pages/Home/Home";
import Quiz from "./pages/Quiz/Quiz";
import GameFinished from "./pages/Game Finished/GameFinished";
import Welcome from "./pages/Welcome/Welcome";

function App() {
  const appState = useAtomValue(appStateAtom);
  return (
    <>
      {appState === "home" ? (
        <Home />
      ) : appState === "welcome" ? (
        <Welcome />
      ) : appState === "quiz" ? (
        <Quiz />
      ) : (
        <GameFinished />
      )}
    </>
  );
}

export default App;
