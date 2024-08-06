import "./App.css";
import Header from "./components/Header/Header.js";
import CoreConcepts from "./components/CoreConcept/CoreConcepts.js";
import Examples from "./components/Examples/Examples.js";

function App() {
  return (
    <>
      <Header />
      <main>
        <CoreConcepts />
        <Examples />
      </main>
    </>
  );
}

export default App;
