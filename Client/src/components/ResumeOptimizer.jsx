import { useState, useContext } from "react";
import { ResumAIContext } from "../context/ResumAIContext";
import { optimizeResume } from "../api/api";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function ResumeOptimizer() {
    const { isLoggedIn } = useContext(ResumAIContext);
    const [jobUrl, setJobUrl] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [optimizedResume, setOptimizedResume] = useState("");
    const [unoptimizedScore, setUnoptimizedScore] = useState(null);
    const [optimizedScore, setOptimizedScore] = useState(null);
    const [changelist, setChangelist] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await optimizeResume(jobUrl, resumeFile);
            console.log(response);
            const rawOutput = response.optimized_resume
            const splitRegex = /changes\s*(?:and|&|\/)\s*rationale[:\-]?\s*/i;
            const resumeWithChangelist = rawOutput.split(splitRegex);

            if (resumeWithChangelist.length < 2) {
                throw new Error("Model parse error: Could not find changelist section");
            }

            const [resume, changelist] = resumeWithChangelist;

            setOptimizedResume(resume.trim());
            setChangelist(changelist.trim());
            setUnoptimizedScore(response.unoptimized_score);
            setOptimizedScore(response.optimized_score);
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.response.data.error}, Details: ${err.response.data.detail}`);
            setError("Failed to optimize resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
                <p className="text-lg font-medium">You must be logged in to use this feature.</p>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-start gap-8 min-h-screen p-10 text-white bg-gray-900">
            
            {unoptimizedScore !== null && (
                <div className="flex flex-col items-center bg-gray-800 p-6 mt-40 rounded-xl shadow-lg w-75">
                    <h3 className="mb-4 text-lg font-semibold text-center">ATS Score Before Optimization</h3>
                    <CircularProgressbar
                        value={unoptimizedScore}
                        text={`${unoptimizedScore}%`}
                        styles={buildStyles({
                            pathColor: "#f97316",
                            textColor: "#ffffff",
                            trailColor: "#374151",
                            textSize: "16px",
                        })}
                    />
                </div>
            )}
            
            <div className="flex min-h-screen p-10 text-white bg-gray-900 flex-col items-center w-full">
                {loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4">
                            <button
                                type="button"
                                className="pointer-events-none inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out disabled:opacity-70 dark:shadow-black/30"
                                disabled>
                                <div
                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em]"
                                    role="status">
                                </div>
                                <span>{' '}Optimizing resume...</span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="w-full max-w-3xl bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Optimize Your Resume</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="jobUrl" className="block mb-1 font-medium">Job Description URL</label>
                            <input
                                id="jobUrl"
                                type="text"
                                value={jobUrl}
                                onChange={(e) => setJobUrl(e.target.value)}
                                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="resume" className="block mb-1 font-medium">Upload Your Resume (PDF)</label>
                            <input
                                id="resume"
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setResumeFile(e.target.files[0])}
                                className="w-full bg-gray-700 text-white file:bg-blue-600 file:border-0 file:px-4 file:py-2 file:rounded file:text-white file:cursor-pointer"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold transition"
                        >
                            Submit
                        </button>
                    </form>

                    {error && <p className="mt-4 text-red-400">{error}</p>}

                    {optimizedResume && (
                        <div className="mt-6">
                            <label className="block mb-1 font-medium">Optimized Resume</label>
                            <textarea
                                readOnly
                                value={optimizedResume}
                                rows={24}
                                className="w-full bg-gray-900 text-white border border-gray-600 p-4 rounded-lg resize-none"
                            />
                        </div>
                    )}

                    {changelist && (
                        <div className="mt-6">
                            <label className="block mb-1 font-medium">Changes and Rationale:</label>
                            <ul className="list-disc list-inside bg-gray-900 text-white border border-gray-600 p-4 rounded-lg space-y-2">
                                {changelist.split('\n').map((line, index) => {
                                    const cleaned = line.replace(/^[-•]\s*/, '').trim();
                                    return cleaned ? <li key={index}>{cleaned}</li> : null;
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {optimizedScore !== null && (
                <div className="flex flex-col items-center bg-gray-800 p-6 mt-40 rounded-xl shadow-lg w-75">
                    <h3 className="mb-4 text-lg font-semibold text-center">ATS Score After Optimization</h3>
                    <CircularProgressbar
                        value={optimizedScore}
                        text={`${optimizedScore}%`}
                        styles={buildStyles({
                            pathColor: "#10b981",
                            textColor: "#ffffff",
                            trailColor: "#374151",
                            textSize: "16px",
                        })}
                    />
                </div>
            )}
            
        </div>
    );
}