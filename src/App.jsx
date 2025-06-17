import Calendar from "./components/Calendar";

function App() {
  return (
    <>
      <div
        className="bg-gradient-to-r from-slate-800 via-green-700 to-black animate-gradient sm:bg-gradient-to-b sm:from-indigo-900 sm:via-green-800 sm:to-black md:bg-gradient-to-tl md:from-green-800 md:via-green-900 md:to-black lg:bg-gradient-to-br xl:bg-gradient-to-l"
        style={{
          backgroundSize: "400% 400%",
          animation: "gradientShift 8s ease infinite",
        }}
      >
        <Calendar />
        <style>
          {`
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}
        </style>
      </div>
    </>
  );
}

export default App;
