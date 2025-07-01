const SpotifyLogin = () => {
  // Point directly to your backend
  const BACKEND_URL = import.meta.env.DEV
    ? "http://localhost:10000" // local FastAPI
    : "https://music-match-backend.onrender.com"; // deployed FastAPI

  const loginUrl = `${BACKEND_URL}/login`;

  return (
    <div className="h-screen flex justify-center items-center bg-black text-white">
      <a href={loginUrl}>
        <button className="bg-green-500 px-6 py-3 rounded-xl text-lg font-bold hover:bg-green-600 transition">
          Login with Spotify
        </button>
      </a>
    </div>
  );
};

export default SpotifyLogin;
