import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DesktopSidebar from './components/DesktopSidebar';
import Dashboard from './pages/company/Dashboard';
import CompanyLayout from './pages/company/CompanyLayout';

function App() {
  // console.log(UserProvider);
  return (
    // <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CompanyLayout />} />
          {/* <Route path="/admin" element={<Admin />} /> */}
        </Routes>
      </Router>
    // </UserProvider>
  );
}

export default App;