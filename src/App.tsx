import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CitizenLayout } from '@/layouts/CitizenLayout';
import { AuthorityLayout } from '@/layouts/AuthorityLayout';
import { CitizenHome } from '@/pages/citizen/Home';
import { SosPage } from '@/pages/citizen/Sos';
import { ReportEntry } from '@/pages/citizen/ReportEntry';
import { ReportType } from '@/pages/citizen/ReportType';
import { ReportLocation } from '@/pages/citizen/ReportLocation';
import { ReportSuccess } from '@/pages/citizen/ReportSuccess';
import { SafetyMapPage } from '@/pages/citizen/SafetyMap';
import { AuthorityDashboard } from '@/pages/authority/Dashboard';
import { AuthorityPatterns } from '@/pages/authority/Patterns';
import { PatternDetail } from '@/pages/authority/PatternDetail';
import { AuthorityAnalytics } from '@/pages/authority/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Citizen routes */}
        <Route element={<CitizenLayout />}>
          <Route path="/" element={<CitizenHome />} />
          <Route path="/sos" element={<SosPage />} />
          <Route path="/report" element={<ReportEntry />} />
          <Route path="/report/type" element={<ReportType />} />
          <Route path="/report/location" element={<ReportLocation />} />
          <Route path="/report/success" element={<ReportSuccess />} />
          <Route path="/map" element={<SafetyMapPage />} />
        </Route>

        {/* Authority routes */}
        <Route element={<AuthorityLayout />}>
          <Route path="/authority" element={<AuthorityDashboard />} />
          <Route path="/authority/patterns" element={<AuthorityPatterns />} />
          <Route path="/authority/patterns/:id" element={<PatternDetail />} />
          <Route path="/authority/analytics" element={<AuthorityAnalytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
