import { useState, useEffect, createContext } from "react";

export const ResumAIContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loginStatus = sessionStorage.getItem('isLoggedIn');
        if (loginStatus === 'true') {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem('isLoggedIn', isLoggedIn);
    }, [isLoggedIn]);

    return (
        <ResumAIContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </ResumAIContext.Provider>
    );
};