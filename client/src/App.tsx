import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";

function App() {
  const [appID, setAppID] = useState("");
  const [sentence, setSentence] = useState("");
  const [onConnectMessage, setOnConnectMessage] = useState("");
  const ws = useRef<WebSocket>();

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({ sentence: {}, app: [] });

  const classify = async (type : string) => {
    setIsLoading(true);
    if (ws.current) {
      ws.current.send(JSON.stringify({type, value: type === 'reviews' ? appID : sentence}));
    }
  };

  useEffect(() => {
    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/classify");
    ws.current.onopen = () => {
      console.log("connected");
    };

    ws.current.onmessage = (evt: any) => {
      const data = JSON.parse(evt.data);
      console.log(data);
      if (!data.result) {
        setOnConnectMessage(data.message);
      }
      setIsLoading(false);
    };
  }, []);

  const spinnerCSS = `
.loader {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #3498db;
  width: 50px;
  height: 50px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
  margin: 2rem auto;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

  return (
    <div className="App container mx-auto">
      <div className="inner mt-10">
        <h3 className="text-2xl text-center px-2 py-3 border-2 mx-32">
          Multi Label Emotion Classification
        </h3>
        <div className="mx-32 mt-10 flex items-center justify-center flex-wrap">
          {["anger", "fear", "joy", "sadness", "surprise"].map((emotion) => (
            <span
              key={emotion}
              className="mb-1 mr-2 inline-flex items-center justify-center text-blue-600 px-4 py-2 text-xs font-bold leading-none text-white bg-gray-200 rounded-full"
            >
              {emotion}
            </span>
          ))}
        </div>
        {onConnectMessage && (
          <div
            className="mt-5 mx-32 flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
            role="alert"
          >
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
            </svg>
            <p>{onConnectMessage}</p>
          </div>
        )}
        <div className="mt-10 mx-32 border-2 p-2">
          <h4 className="text-center">Testing the model with new data</h4>
          <div className="mt-10">
            <span className="text-sm">Write a sentence</span>
            <textarea
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
              placeholder="Text Body"
              className="textarea my-2 h-24 w-full shadow bg-gray-100 p-2 mb-3 border rounded leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
            <button onClick={() => classify('sentence')} className="bg-white  cursor-pointer hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
              Classify Sentence
            </button>
          </div>
          <div className="mt-10">
            <span className="text-sm">Enter Playstore App ID</span>
            <input
              className="shadow my-2 appearance-none border rounded w-full py-2 px-3 bg-gray-100 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={appID}
              onChange={(e) => setAppID(e.target.value)}
              placeholder="e.g., com.twitter.android"
            />
            <button onClick={() => classify('reviews')} className="bg-white cursor-pointer hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
              Classify Reviews
            </button>
          </div>
          {isLoading && <div className="flex items-center justify-center">
            <div className="loader"></div>
            <style>{spinnerCSS}</style>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default App;
