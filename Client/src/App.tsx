import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/assets/vite.svg";

function App() {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            className="border-l-sky-700 p-20"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="flex justify-center align-center p-4">
        <button
          className="py-0.5 border-2 border-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <button
          className="py-0.5 border-2 border-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
          onClick={() => setCount((count) => count - 1)}
        >
          Decrease the value!
        </button>

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
