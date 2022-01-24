import axios from "axios";
import { useMemo, useState } from "react";

function App() {
  const [appID, setAppID] = useState("");
  const [sentence, setSentence] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState({});

  const submit = async () => {};

  const result = useMemo(() => {
    return [];
  }, [response]);

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
        <div className="mx-32 mt-10 flex items-center justify-center">
          {["anger", "fear", "joy", "sadness", "surprise"].map((emotion) => (
            <span className="mr-2 inline-flex items-center justify-center px-4 py-2 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
              {emotion}
            </span>
          ))}
        </div>
        <div className="mt-10 mx-32 border-2 p-2">
          <h4 className="text-center">Testing the model with new data</h4>
          <div className="mt-10">
            <span className="text-sm">Write a sentence</span>
            <textarea
              placeholder=" Bio"
              className="textarea my-2 h-24 w-full bg-gray-100 padding-1"
            ></textarea>
          </div>
          <div className="mt-10">
            <span className="text-sm">Enter Playstore App ID</span>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="e.g., com.twitter.android"
            />
          </div>
          <div className="flex items-center justify-center">
          <div className="loader"></div>        
            <style>
              {spinnerCSS}
            </style>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
