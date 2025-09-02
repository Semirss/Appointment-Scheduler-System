import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import DesktopSidebar from './components/DesktopSidebar';
// import Dashboard from './pages/company/Dashboard';
import CompanyLayout from './pages/company/CompanyLayout';
import { CustomizationProvider } from './context/CustomizationContext';
import CompanyLogin from './pages/company/CompanyLogin';
import AdminCustomization from './pages/admin/AdminCustomization';
// import Admin from './pages/admin/Admin';
// import EnhancedAdmin from './pages/admin/EnhancedAdmin';
// import Login from './pages/admin/AdminLogin';
import { CompanyProvider } from './context/CompanyContext';
import GlobalStyles from './components/GlobalStyles';
import FontLoader from './components/FontLoader';
import AppointmentBooking from './pages/user/User';

function App() {
  // console.log(UserProvider);
  return (
    <CustomizationProvider>
      <CompanyProvider>
        <GlobalStyles />
        <FontLoader />
        <Router>
          <Routes>
            <Route path='/login' element={<CompanyLogin />}></Route>
            {/* <Route path='/adminLogin' element={<Login />}></Route> */}
            <Route path="/" element={<CompanyLayout />} />
            <Route path="/adminCustomization" element={<AdminCustomization />} />
            <Route path="/book-appointment" element={<AppointmentBooking />} />
            {/* <Route path="/admin" element={<EnhancedAdmin />}></Route> */}
            {/* <Route path="/admin" element={<Admin />} /> */}
          </Routes>
        </Router>
      </CompanyProvider>
    </CustomizationProvider>
  );
}

export default App;