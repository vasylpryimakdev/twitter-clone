import { useParams } from "react-router-dom";

export const UserPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>User page</h2>
      <p>User ID: {id}</p>

    </div>
  );
};
