import TabComponent from "../TabButton/TabButton";
import { EXAMPLES } from "../../data";
import { useState } from "react";
import Section from "../Section/Section";
import Tabs from "../Tabs/Tabs";

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
    <Section id="examples" title="Examples">
      <Tabs
        buttons={
          <>
            <TabComponent
              isSelected={selectedText === "components"}
              onClick={() => {
                handleSelect("components");
              }}
            >
              Components
            </TabComponent>
            <TabComponent
              isSelected={selectedText === "jsx"}
              onClick={() => {
                handleSelect("jsx");
              }}
            >
              JSX
            </TabComponent>
            <TabComponent
              isSelected={selectedText === "props"}
              onClick={() => {
                handleSelect("props");
              }}
            >
              Props
            </TabComponent>
            <TabComponent
              isSelected={selectedText === "state"}
              onClick={() => {
                handleSelect("state");
              }}
            >
              State
            </TabComponent>
          </>
        }
      >
        {initialText}
      </Tabs>
    </Section>
  );
}
