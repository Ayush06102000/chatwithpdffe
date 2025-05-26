import { useRef, useState } from "react";
import axios from "axios";

function App() {
  const pdfRef = useRef(null);
  const queryRef = useRef(null);
  const [data, setData] = useState(null);

  const handleUpload = async () => {
    const fileInput = pdfRef.current;
    if (!fileInput.files.length) {
      alert("Please select a PDF file first");
      return;
    }

    const file = fileInput.files[0];
    if (file.type !== "application/pdf") {
      alert("Please select a valid PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("PDF uploaded successfully!");
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  const generateResult = async () => {
    try {
      const response = await axios.post("http://localhost:3000/getResult", {
        query: queryRef.current.value,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching result:", error);
      alert("Error fetching result");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <div style={{ marginBottom: "20px" }}>
        <input
          ref={pdfRef}
          type="file"
          accept="application/pdf"
          placeholder="Upload your PDF"
        />
        <button onClick={handleUpload}>Upload PDF</button>
      </div>

      <div>
        <input ref={queryRef} type="text" placeholder="Enter your question" />
        <button onClick={generateResult}>Ask</button>
      </div>

      {/* Conditional rendering of data */}
      <div className="m-2 flex flex-wrap ">
        {data ? (
          <div>{typeof data === "object" ? JSON.stringify(data.respnse, null, 2) : data}</div>
        ) : (
          <p>No result yet. Ask a question to see a response.</p>
        )}
      </div>
    </div>
  );
}

export default App;
