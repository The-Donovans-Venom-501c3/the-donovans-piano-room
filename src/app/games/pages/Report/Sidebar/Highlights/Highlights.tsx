import { useState } from "react";
import "./Highlights.scss";
import InfoButton from "../InfoButton/InfoButton";

const placeholderDescription =
  "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.";

const highlights = [
  { key: "rank", label: "rank", value: "10", description: placeholderDescription },
  { key: "streak", label: "streak", value: "2", description: placeholderDescription },
  { key: "gpa", label: "GPA", value: "3.5", description: placeholderDescription },
  { key: "coins", label: "coins", value: "125", description: placeholderDescription },
];

export default function Highlights() {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const toggle = (key: string) => {
    setOpenKeys((keys) =>
      keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]
    );
  };

  return (
    <section className="highlights-block font-roboto">
      <h3 className="highlights-heading">
        Your highlights
      </h3>
      <dl className="highlights-list">
        {highlights.map(({ key, label, value, description }) => {
          const isOpen = openKeys.includes(key);

          return (
            <div
              key={key}
              className={`highlight-item ${isOpen ? "is-open" : ""}`}
            >
              <dt className="highlight-label">
                <span>{label}</span>
                <InfoButton
                  label={`More info about your ${label}`}
                  expanded={isOpen}
                  controls={`highlight-${key}`}
                  onClick={() => toggle(key)}
                />
              </dt>
              <dd
                id={`highlight-${key}`}
                className={isOpen ? "highlight-description" : "highlight-value"}
              >
                {isOpen ? description : value}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
