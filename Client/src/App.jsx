import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/ResumAIContext';
import Navbar from './components/Navbar';
import ResumeOptimizer from './components/ResumeOptimizer';
import CoverLetterGenerator from './components/CoverLetterGenerator';
import InterviewQuestionGenerator from './components/InterviewQuestionGenerator';
import Login from './components/Login';
import Register from './components/Register';
import './App.css'

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
        <Navbar />
          <Routes>
            <Route path='/*' element={<ResumeOptimizer />}/>
            <Route path='/ResumeOptimizer' element={<ResumeOptimizer />}/>
            <Route path='/CoverLetterGenerator' element={<CoverLetterGenerator />}/>
            <Route path='/InterviewQuestionGenerator' element={<InterviewQuestionGenerator />}/>
            <Route path='/Login' element={<Login />}/>
            <Route path='/Register' element={<Register />}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;