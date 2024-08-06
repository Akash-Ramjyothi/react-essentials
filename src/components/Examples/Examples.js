import TabComponent from "../TabButton/TabButton";
import { EXAMPLES } from "../../data";
import { useState } from "react";

export default function Examples() {
  const [selectedText, setSelectedText] = useState();

  let initialText;

  if (!selectedText) {
    initialText = <p>Please select a topic.</p>;
  } else {
    initialText = (
      <div id="tab-content">
        <h3>{EXAMPLES[selectedText].title}</h3>
        <p>{EXAMPLES[selectedText].description}</p>
        <pre>
          <code>{EXAMPLES[selectedText].code}</code>
        </pre>
      </div>
    );
  }

  function handleSelect(selectedButton) {
    setSelectedText(selectedButton);
  }

  return (
    <section id="examples">
      <h2>Examples</h2>
      <menu>
        <TabComponent
          isSelected={selectedText === "components"}
          onSelect={() => {
            handleSelect("components");
          }}
        >
          Components
        </TabComponent>
        <TabComponent
          isSelected={selectedText === "jsx"}
          onSelect={() => {
            handleSelect("jsx");
          }}
        >
          JSX
        </TabComponent>
        <TabComponent
          isSelected={selectedText === "props"}
          onSelect={() => {
            handleSelect("props");
          }}
        >
          Props
        </TabComponent>
        <TabComponent
          isSelected={selectedText === "state"}
          onSelect={() => {
            handleSelect("state");
          }}
        >
          State
        </TabComponent>
      </menu>
      {initialText}
    </section>
  );
}
