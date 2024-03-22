import {RouterProvider} from "react-router-dom";
import root from "./router/root";
import { AudioPlayerProvider } from './component/AudioPlayerContext';

function App() {
  return (
    <RouterProvider router={root}/>
  );
}

export default App;