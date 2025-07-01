
const SpotifyLogin = () => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  console.log("SpotifyLogin loaded");

  const REDIRECT_URI =
    import.meta.env.DEV
      ? "http://localhost:5173/dashboard"
      : "https://music-match-frontend-fawn.vercel.app/dashboard";

  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = [
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-library-read",
    "user-top-read",
  ];

  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join("%20")}`;

  return (
    <div className="h-screen flex justify-center items-center bg-black text-white">
      <a href={loginUrl}>
        <button className="bg-green-500 px-6 py-3 rounded-xl text-lg font-bold">
          Login with Spotify
        </button>
      </a>
    </div>
  );
};

export default SpotifyLogin;
