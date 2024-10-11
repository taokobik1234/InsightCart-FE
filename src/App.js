import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import './App.css';
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
function App() {
  return (
    <div className="App">
     <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/home"element={ <HomeScreen /> }/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
