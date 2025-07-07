import { useNavigate } from "react-router-dom";

const Matches = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-green-400 mb-6">🎧 Your Matches</h1>
      <p className="text-gray-300 mb-4">This is where your music matches will appear.</p>

      {/* Go Back Button */}
      <button
        onClick={handleGoBack}
        className="mt-6 px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
      >
        ← Go Back to Dashboard
      </button>
    </div>
  );
};

export default Matches;
