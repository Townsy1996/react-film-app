import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';  
import Findafilm from './pages/Findafilm';
import Starlist from './pages/StarList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/findafilm' element={<Findafilm />} />
        <Route path='/starlist' element={<Starlist />} />
        
      </Routes>
    </Router>
  );
}

export default App;
