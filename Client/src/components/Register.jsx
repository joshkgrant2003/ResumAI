import { useState, useContext } from "react";
import { ResumAIContext } from "../context/ResumAIContext";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/api";

function Register() {
    const { setIsLoggedIn } = useContext(ResumAIContext);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isValidName = (name) => {
        return /^[A-Za-z]+$/.test(name);
    };

    // NOTE: regular expressions were made with the help of https://regex101.com/
    const isValidForm = () => {
        let newErrors = {};
        
        // first and last name
        if (!isValidName(formData.firstName)) {
            newErrors.firstName = "First name cannot contain numbers or spaces.";
        }
        if (!isValidName(formData.lastName)) {
            newErrors.lastName = "Last name cannot contain numbers or spaces.";
        }

        // email
        if (!/^[\w.-]+@[A-Za-z]+\.[A-Za-z]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        // username
        if (/[^A-Za-z0-9]/.test(formData.username) || formData.username === "") {
            newErrors.username = "Username must not contain spaces or special characters.";
        }
        if (/^[0-9]/.test(formData.username)) {
            newErrors.username = "Username must not start with a number.";
        }

        // password
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(formData.password)) {
            newErrors.password = "Password must be at least 10 characters, contain one uppercase, one lowercase, and one number.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isValidForm()) {
            try {
                setLoading(true);
                const userData = {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                };
                const res = await createUser(userData);
                console.log(res);
                if (res.status === 200) {
                    alert('Account successfully created!');
                    setIsLoggedIn(true);
                    navigate('/ResumeOptimizer');
                }
            } catch (error) {
                console.error(error);
                alert('Something went wrong... Please try again later.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            {loading && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
                    <div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4'>
                        {/* Loading button component found at https://tw-elements.com/docs/standard/components/spinners/ */}
                        <button
                            type="button"
                            className="pointer-events-none inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 disabled:opacity-70 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                            disabled>
                            <div
                                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                role="status">
                            </div>
                            <span>{' '}Loading...</span>
                        </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg w-100 space-y-4">
                <h2 className="text-2xl font-semibold text-center">Register</h2>
                <input 
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="input-field w-full p-2 mt-1 border border-gray-600 rounded-md bg-gray-900 text-white"
                />
                {errors.firstName && <p className="error-text text-red-500">{errors.firstName}</p>}

                <input 
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="input-field w-full p-2 mt-1 border border-gray-600 rounded-md bg-gray-900 text-white"
                />
                {errors.lastName && <p className="error-text text-red-500">{errors.lastName}</p>}

                <input 
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input-field w-full p-2 mt-1 border border-gray-600 rounded-md bg-gray-900 text-white"
                />
                {errors.email && <p className="error-text text-red-500">{errors.email}</p>}

                <input 
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="input-field w-full p-2 mt-1 border border-gray-600 rounded-md bg-gray-900 text-white"
                />
                {errors.username && <p className="error-text text-red-500">{errors.username}</p>}

                <input 
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="input-field w-full p-2 mt-1 border border-gray-600 rounded-md bg-gray-900 text-white"
                />
                {errors.password && <p className="error-text text-red-500">{errors.password}</p>}

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-sm transition duration-200"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Register;