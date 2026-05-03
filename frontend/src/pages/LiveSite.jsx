import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const LiveSite = () => {
  const { id } = useParams();
  const [html, setHtml] = React.useState("");
  const [error, setError] = React.useState("");
  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(`/api/website/get-by-slug/${id}`, {
          withCredentials: true,
        });
        setHtml(result.data.latestCode);
      } catch (error) {
        console.log(error);
        setError("site not found or you don't have access to it.");
      }
    };

    handleGetWebsite();
  }, [id]);

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  return (
    <iframe
      title="Live Site"
      srcDoc={html}
      className="w-screen h-screen border-none"
      sandbox="allow-scripts allow-same-origin allow-forms"
    />
  );
};

export default LiveSite;
