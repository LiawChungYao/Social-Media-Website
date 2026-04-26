import { useState } from "react";

const backend = import.meta.env.VITE_BACKEND_SERVER;
function Upload() {
  const [file, setFile] = useState(null);
  const handleUpload = async () => {
    if (!file) {
      console.log("Handle no file selected");
      return;
    }
    
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(backend + "/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Uploaded URL:", data.url);
  };

  return (
    <div>    
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      /><br/>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Upload;