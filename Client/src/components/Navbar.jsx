import { useContext } from "react";
import { ResumAIContext } from "../context/ResumAIContext";
import { Link, useNavigate } from "react-router-dom";
import resumAILogo from "../assets/ResumAI-Logo.png";

function Navbar() {
    const { isLoggedIn, setIsLoggedIn } = useContext(ResumAIContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/Login');
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <img src={resumAILogo} alt="ResumAI Logo" className="h-20 w-20"/>
                    <h1 className="text-2xl font-extrabold">ResumAI</h1>
                </div>
                <div className="space-x-8 flex items-center">
                    <Link to="/ResumeOptimizer" className="hover:text-gray-300 transition font-medium">ResumAI Optimizer</Link>
                    <Link to="/CoverLetterGenerator" className="hover:text-gray-300 transition font-medium">Cover Letter Generator</Link>
                    <Link to="/InterviewQuestionGenerator" className="hover:text-gray-300 transition font-medium">Interview Question Generator</Link>
                    {!isLoggedIn && (
                        <>
                            <Link to="/Login" className="hover:text-gray-300 transition font-medium">Login</Link>
                            <Link to="/Register" className="hover:text-gray-300 transition font-medium">Register</Link>                    
                        </>
                    )}
                    {isLoggedIn && (
                        <button onClick={handleLogout} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold text-white transition duration-300">
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;