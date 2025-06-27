import { useState, useContext } from "react";
import { ResumAIContext } from "../context/ResumAIContext";
import { useNavigate } from "react-router-dom";
import { authUser } from "../api/api";

function Login() {
    const { isLoggedIn, setIsLoggedIn } = useContext(ResumAIContext);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleLogout = () => {
        setFormData({username: "", password: ""});
        setIsLoggedIn(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            alert("You must enter a username and password!");
            return;
        }

        try {
            setLoading(true);
            const res = await authUser(formData);
            console.log(res);

            if (res.status === 200) {
                setIsLoggedIn(true);
                alert(`Login successful! Welcome, ${res.data.first_name}!`);
                navigate('/ResumeOptimizer');
            }
        } catch (error) {
            console.error(error);

            if (error.response && error.response.status === 401) {
                alert('Incorrect credentials, please try again.');
            } else {
                alert('Something went wrong... Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-sm w-100">
                {isLoggedIn ? (
                    <>
                        <h2 className="text-2xl font-semibold text-center">You are logged in!</h2>
                        <button
                            onClick={handleLogout}
                            className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold transition duration-300"
                        >
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold mb-4 text-center">Login to ResumAI</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                            />
                            <input 
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold transition duration-300"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default Login;