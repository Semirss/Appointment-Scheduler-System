import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import DesktopSidebar from './components/DesktopSidebar';
// import Dashboard from './pages/company/Dashboard';
import CompanyLayout from './pages/company/CompanyLayout';
import { CustomizationProvider } from './context/CustomizationContext';
import CompanyLogin from './pages/company/CompanyLogin';
import AdminCustomization from './pages/admin/AdminCustomization';

function App() {
  // console.log(UserProvider);
  return (
    <CustomizationProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<CompanyLogin />}></Route>
          <Route path="/" element={<CompanyLayout />} />
          <Route path="/adminCustomization" element={<AdminCustomization />} />
          {/* <Route path="/admin" element={<Admin />} /> */}
        </Routes>
      </Router>
    </CustomizationProvider>
  );
}

export default App;