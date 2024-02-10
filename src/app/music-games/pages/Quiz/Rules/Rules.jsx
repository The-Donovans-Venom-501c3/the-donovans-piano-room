import "./Rules.scss";
import RulesModal from "./RulesModal/RulesModal";
import { useAtomValue } from "jotai";
import { quizStateAtom } from "../../../store/atoms";

const Rules = () => {
  const quizState = useAtomValue(quizStateAtom);
//   console.log("quiz State: ", quizState);

  return <div>{quizState === "rules" && <RulesModal />}</div>;
};

export default Rules;
