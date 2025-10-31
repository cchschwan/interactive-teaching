import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Exercises from './pages/Exercises';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/exercises" element={<Exercises />} />
      </Routes>
    </Router>
  );
}

export default App;
