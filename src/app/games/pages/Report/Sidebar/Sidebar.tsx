import "./Sidebar.scss";
import AverageScore from "./AverageScore/AverageScore";
import Highlights from "./Highlights/Highlights";

export default function Sidebar() {
  return (
    <div className="report-sidebar">
      <AverageScore />
      <Highlights />
    </div>
  );
}
