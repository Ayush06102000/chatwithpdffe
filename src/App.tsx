import { useRef, useState } from "react";
import axios from "axios";

function App() {
  const pdfRef = useRef(null);
  const queryRef = useRef(null);
  const [data, setData] = useState(null);
  const [load,setLoad] = useState(true);

  const handleUpload = async () => {
    const fileInput = pdfRef.current;
    //@ts-ignore
    if (!fileInput.files.length) {
      alert("Please select a PDF file first");
      return;
    }

    //@ts-ignore
    const file = fileInput.files[0];
    if (file.type !== "application/pdf") {
      alert("Please select a valid PDF file");
      return;
    }
    setLoad(false);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post(
        "https://chatwithpdfbe.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setLoad(true);
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
      const response = await axios.post("https://chatwithpdfbe.onrender.com/getResult", {
        //@ts-ignore
        query: queryRef.current.value,
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching result:", error);
      alert("Error fetching result");
    }
  };

  return (
    <div className="flex m-1 border-purple-900 shadow-red-500 shadow-2xl border-4 rounded-2xl overflow-hidden bg-black ">
      <div className="w-[40%] bg-black text-white h-screen border-r-2">
        <input
          ref={pdfRef}
          type="file"
          accept="application/pdf"
          placeholder="Upload your PDF"
          className="border-2 border-red-800 p-8  rounded-2xl mt-[40%] w-[80%] m-8 bg-purple-950"
        ></input>
        <button className="border-2 border-purple-950 bg-purple-800 px-8 mx-[30%] py-2 rounded-xl hover:bg-purple-900" onClick={handleUpload}>{ load? "Upload Pdf":(<div className="flex"><span className="relative flex size-3 mr-2 my-1">
  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
  <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
</span> Uploading...</div>) }</button>
      </div>

      <div className="w-[60%] bg-black text-white h-screen">
        <input
          className="bg-white text-black w-[90%] m-[5%] h-15 rounded-2xl border-purple-950 border-4 hover:border-4 hover:border-purple-900 p-8"
          ref={queryRef}
          type="text"
          placeholder="Enter your question"
        />

        <br></br>
        <button
          className="border-2 border-purple-950 bg-purple-800 px-8 mx-[35%] py-2 rounded-xl hover:bg-purple-900"
          onClick={generateResult}
        >
          Ask
        </button>

        {/* Conditional rendering of data */}
        <div className="m-2">
          {data ? (
            <div className="text-white">
              {typeof data === "object"
              //@ts-ignore
                ? JSON.stringify(data.respnse, null, 2)
                : data}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
