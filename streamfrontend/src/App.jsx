import { useState } from "react";
import "./App.css";
import VideoUpload from "./components/VideoUpload";
import VideoPlayer from "./components/VideoPlayer";
import { Button, TextField } from "@mui/material";

function App() {
  const [videoId, setVideoId] = useState(" ");
  const [fieldValue, setFieldValue] = useState("");

  const handlePlayClick = () => {
    if (fieldValue.trim() === "") {
      alert("Please enter a valid video ID");
      return;
    }
    setVideoId(fieldValue);
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-white py-5 text-center">
        Video Streaming App
      </h1>

      {/* Flex container to position items left and right */}
      <div className="flex justify-between items-start py-9 px-12">
        <div className="video-container">
          <VideoPlayer src={`http://localhost:5000/api/v1/videos/${videoId}/master.m3u8`} />
        </div>

        <div>
          <TextField
            name="videoId"
            label="Enter Video ID"
            value={fieldValue}
            onChange={(event) => setFieldValue(event.target.value)}
            fullWidth
            sx={{
              maxWidth: 500,
              backgroundColor: "#333",
              color: "white",
              borderRadius: "4px",
            }}
            InputProps={{
              style: {
                color: "white",
              },
            }}
          />
          <Button
            onClick={handlePlayClick}
            sx={{
              backgroundColor: "#3f51b5",
              color: "white",
              borderRadius: "8px",
              marginTop: "20px",
              padding: "10px 20px",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#303f9f", // Darker on hover
                boxShadow: "0 6px 8px rgba(0, 0, 0, 0.2)",
                transform: "translateY(-2px)", // Lift effect on hover
              },
            }}
          >
            Play
          </Button>
        </div>

        <div className="upload-container">
          <VideoUpload />
        </div>
      </div>
    </>
  );
}

export default App;
