import Header from './components/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {Provider} from "react-redux"
import Photos from './components/Photos';
import About from './components/About';
import Main from './components/Main';

function App() {
  return (
      <BrowserRouter basename="/">
        <Header/>
        <Routes>
          <Route path="/" element={<><h1>Сегментируйте свои изображения с удовольствием</h1><h2>1000000 пользователей уже воспользовались и оценили наш сервис</h2><Main /></>}/>
          <Route path="/about" element={<><About /></>}/>
          <Route path="/photos" element={<><Photos /></>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
