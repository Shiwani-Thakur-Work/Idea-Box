import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/shared/MainLayout';
import Dashboard from './pages/Dashboard';
import IdeaDetail from './pages/IdeaDetail';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/idea/:id" element={<IdeaDetail />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
