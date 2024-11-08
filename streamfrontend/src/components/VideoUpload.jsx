import {
  Box,
  Button,
  LinearProgress,
  TextareaAutosize,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const VideoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [meta, setMeta] = useState({
    title: "",
    description: "",
  });
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // for dialog box
  const [openSnackbar, setOpenSnackbar] = useState(false); // for snackbar
  const [videoId, setVideoId] = useState(""); // Video ID state

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  function formFieldChange(event) {
    setMeta({
      ...meta,
      [event.target.name]: event.target.value,
    });
  }

  function handleForm(formEvent) {
    formEvent.preventDefault();
    if (!selectedFile) {
      alert("Select File!");
      return;
    }
    // submit file to server
    saveVideoToServer(selectedFile, meta);
  }

  async function saveVideoToServer(video, videoMetaDeta) {
    setUploading(true);
    setProgress(0); // Reset progress when starting upload

    // API call
    try {
      let formData = new FormData();
      formData.append("title", videoMetaDeta.title);
      formData.append("description", videoMetaDeta.description);
      formData.append("file", selectedFile);

      let response = await axios.post(
        "http://localhost:5000/api/v1/videos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(progress);
          },
        }
      );

      // After successful upload, update the videoId state
      const videoId = response.data.videoId; // assuming response contains `videoId`
      setVideoId(videoId); // Update state with the new videoId

      setMessage("File Uploaded Successfully!");
      setUploading(false);
      setOpenSnackbar(true); // Show snackbar on success
      setOpenDialog(true); // Show dialog on success
    } catch (error) {
      setMessage("Error uploading file.");
      setUploading(false);
    }
  }

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Function to handle closing the snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="text-white w-50">
      <div className="max-w-lg mx-auto bg-indigo-400 shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="font-bold text-center">Upload Video</h1>
        <form noValidate onSubmit={handleForm} className="flex flex-col items-center space-y-4">
          <TextField
            name="title"
            onChange={formFieldChange}
            fullWidth
            placeholder="Enter title"
          />
          <textarea
            onChange={formFieldChange}
            name="description"
            className="custom-textarea"
            placeholder="Enter description"
            style={{
              backgroundColor: "transparent",
              width: "100%",
              border: "1px solid black",
            }}
          ></textarea>
          <div className="shrink-0">
            <img
              className="h-16 w-16 object-cover rounded-full"
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80"
              alt="Current profile photo"
            />
          </div>
          <label className="block">
            <span className="sr-only">Choose profile photo</span>
            <input
              name="file"
              onChange={handleFileChange}
              type="file"
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
            />
          </label>

          {/* Only show LinearProgress when uploading */}
          {uploading && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{
              mt: 2, // Margin top for spacing
              backgroundColor: "#3b82f6", // Custom background color
              height: "48px", // Adjust button height
              "&:hover": {
                backgroundColor: "#2563eb", // Custom hover color
              },
              fontWeight: "bold", // Optional: Makes text bold
              borderRadius: "25px",
            }}
          >
            Upload
          </Button>
          <Button
            fullWidth
            sx={{
              color: "white",
              mt: 2, // Margin top for spacing
              backgroundColor: "#3b82f6", // Custom background color
              height: "48px", // Adjust button height
              "&:hover": {
                backgroundColor: "#223eb", // Custom hover color
              },
              fontWeight: "bold", // Optional: Makes text bold
              borderRadius: "25px",
            }}
            type="reset"
          >
            Clear Fields
          </Button>
        </form>

        {/* Stylish Success Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.5rem" }}>
            Upload Successful!
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center", backgroundColor: "#f5f5f5", padding: "20px" }}>
            <Typography variant="h6" sx={{ color: "#4CAF50", fontWeight: "bold" }}>
              {message}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: "10px" }}>
              Your video has been uploaded successfully. You can now play it using its id: <strong>{videoId}</strong>
            </Typography>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                backgroundColor: "#4CAF50",
                color: "white",
                borderRadius: "20px",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#388E3C",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000} // Snackbar auto hides after 3 seconds
          message="File Uploaded Successfully!"
          onClose={handleCloseSnackbar}
        />
      </div>

      <style jsx>{`
        .custom-textarea {
          width: 100%; /* Make it full width */
          padding: 10px; /* Padding inside the textarea */
          background-color: transparent; /* Transparent background */
          border: 1px solid #ccc; /* Light border */
          color: #333; /* Text color */
          font-size: 1rem; /* Font size */
          border-radius: 8px; /* Rounded corners */
          font-family: Arial, sans-serif; /* Font style */
          resize: vertical; /* Allow vertical resizing */
        }

        /* Change placeholder color */
        .custom-textarea::placeholder {
          color: #555555; /* Light grayish blue placeholder */
          font-style: italic; /* Optional: Make placeholder text italic */
        }

        /* Optional: Focus state for the textarea */
        .custom-textarea:focus {
          outline: none; /* Remove outline */
          border-color: #3b82f6; /* Blue border on focus */
        }
      `}</style>
    </div>
  );
};

export default VideoUpload;
