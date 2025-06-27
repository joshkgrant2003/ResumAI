import { useState, useContext } from "react";
import { ResumAIContext } from "../context/ResumAIContext";
import { generateCoverLetter } from "../api/api";

export default function CoverLetterGenerator() {
    const { isLoggedIn } = useContext(ResumAIContext);
    const [jobUrl, setJobUrl] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await generateCoverLetter(jobUrl, resumeFile);
            console.log(response);
            const cover_letter = response.cover_letter;

            setCoverLetter(cover_letter.trim());
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.response.data.error}, Details: ${err.response.data.detail}`);
            setError("Failed to generate cover letter. Please try again.");
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
        <div className="flex min-h-screen p-20 text-white bg-gray-900 flex-col items-center">
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
                            <span>{' '}Generating cover letter...</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full max-w-3xl bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Generate Cover Letter</h2>

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

                {coverLetter && (
                    <div className="mt-6">
                        <label className="block mb-1 font-medium">Cover Letter</label>
                        <textarea
                            readOnly
                            value={coverLetter}
                            rows={24}
                            className="w-full bg-gray-900 text-white border border-gray-600 p-4 rounded-lg resize-none"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}