import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {Provider} from "react-redux"
import Photos from './components/Photos';
import About from './components/About';


function App() {
  return (
      <BrowserRouter basename="/">
        <Header/>
        <Routes>
          <Route path="/" element={<><h1>Сегментируйте свои изображения с удовольствием</h1><Photos /></>}/>
          <Route path="/about" element={<><About /></>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
