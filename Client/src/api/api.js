import axios from "axios";

const host = import.meta.env.VITE_HOST ? import.meta.env.VITE_HOST : import.meta.env.VITE_LOCAL_HOST;

export async function optimizeResume(jobUrl, pdfFile) {
    const formData = new FormData();
    formData.append("job_url", jobUrl);
    formData.append("resume", pdfFile);

    const response = await axios.post(`${host}/api/optimize_resume/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': host,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With', 
        },
    });

    return response.data;
}

export async function generateCoverLetter(jobUrl, pdfFile) {
    const formData = new FormData();
    formData.append("job_url", jobUrl);
    formData.append("resume", pdfFile);

    const response = await axios.post(`${host}/api/generate_cover_letter/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': host,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With', 
        },
    });

    return response.data;
}

export async function generateInterviewQuestions(jobUrl) {
    const formData = new FormData();
    formData.append("job_url", jobUrl);

    const response = await axios.post(`${host}/api/generate_interview_questions`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': host,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With', 
        },
    });

    return response.data;
}

export async function getUsers() {
    const res = await axios.get(`${host}/api/users`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': host,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With', 
        },
    }, { withCredentials: true });
    const data = res.data;
    return data;
}

export async function getUser(id) {
    const res = await axios.get(`${host}/api/users/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': host,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With', 
        },
    }, { withCredentials: true });
    const data = res.data;
    return data;
}

export async function createUser(user) {
    const json = JSON.stringify(user);
    const res = await axios.post(`${host}/api/users/create`, json, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': host,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With', 
        },
    }, { withCredentials: true });
    return res;
}

export async function authUser(userCredentials) {
    const json = JSON.stringify(userCredentials);
    const res = await axios.post(`${host}/api/users/auth`, json, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': host,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With', 
        },
    }, { withCredentials: true });
    return res;
}