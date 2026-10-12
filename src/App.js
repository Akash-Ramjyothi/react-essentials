import "./App.css";
import Header from "./components/Header/Header.js";
import CoreConcepts from "./components/CoreConcept/CoreConcepts.js";
import Examples from "./components/Examples/Examples.js";

function App() {
  return (
    <div>
      <Header />
      <main className="app-main">
        <CoreConcepts />
        <Examples />
      </main>
    <div/>
  );
}

export default App;
