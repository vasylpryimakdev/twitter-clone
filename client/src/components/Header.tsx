import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/login">Login</Link>
    </div>
  );
};
