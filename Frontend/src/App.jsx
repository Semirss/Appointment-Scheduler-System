import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesktopSidebar from './components/DesktopSidebar';

function App() {
  // console.log(UserProvider);
  return (
    // <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DesktopSidebar />} />
          {/* <Route path="/admin" element={<Admin />} /> */}
        </Routes>
      </Router>
    // </UserProvider>
  );
}

export default App;