import { useState } from "react";
import axios from "axios";
import { Upload, Send } from "lucide-react";

export default function App() {

  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendEmails = async () => {

    if (!file) {
      return alert("Upload Excel/CSV file");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("message", message);

    try {

      setStatus("Sending emails...");

      const res = await axios.post(
        "http://localhost:5000/api/send-emails",
        formData
      );

      setStatus(res.data.message);

    } catch (error) {

      console.log(error);

      setStatus("Failed to send emails");
    }
  };

  return (
    <div className="min-h-screen p-10 bg-slate-900 text-white">

      <div className="max-w-4xl mx-auto">

        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl">

          <h1 className="text-4xl font-bold mb-2">
            Bulk Email Sender
          </h1>

          <p className="text-slate-400 mb-8">
            Upload Excel/CSV and send personalized emails instantly.
          </p>

          <label className="border-2 border-dashed border-slate-600 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition mb-6">

            <Upload size={50} />

            <p className="mt-4">
              Upload Excel or CSV File
            </p>

            <input
              type="file"
              accept=".csv,.xlsx"
              hidden
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />
          </label>

          <input
            type="text"
            placeholder="Email Subject"
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-slate-700 border border-slate-600 mb-5"
          />

          <textarea
            rows="10"
            placeholder="Hello {{name}}"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="w-full p-4 rounded-xl bg-slate-700 border border-slate-600 mb-6"
          />

          <button
            onClick={sendEmails}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl flex items-center gap-3 transition"
          >
            <Send size={20} />
            Send Emails
          </button>

          <div className="mt-6 text-lg font-semibold">
            {status}
          </div>

        </div>

      </div>

    </div>
  );
}