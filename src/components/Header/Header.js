import "./Header.css";

let reactCodeConceptsPng =
  "https://raw.githubusercontent.com/academind/react-complete-guide-course-resources/main/code/03%20React%20Essentials/01-starting-project/src/assets/react-core-concepts.png";

const randValue = ["Core", "Fundamental", "Crucial"];

function genRandom(max) {
  return Math.floor(Math.random() * (max + 1));
}

export default function Header() {
  let description = randValue[genRandom(2)];
  return (
    <header>
      <img src={reactCodeConceptsPng} alt="Stylized atom" />
      <h1>React Essentials</h1>
      <p>
        {description} React concepts you will need for almost any app you are
        going to build!
      </p>
    </header>
  );
}
