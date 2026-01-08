import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  // 🔐 Axios instance with token
  const axiosAuth = axios.create({
    baseURL: "http://10.156.230.17:5000",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // 🔁 Check token + fetch notes
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axiosAuth
      .get("/notes")
      .then((res) => setNotes(res.data))
      .catch(() => {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  // ➕ Add / ✏️ Update note
  const handleAddNote = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        const res = await axiosAuth.put(`/notes/${editId}`, {
          title,
          content,
        });

        setNotes((prev) => prev.map((n) => (n._id === editId ? res.data : n)));
        setEditId(null);
      } else {
        const res = await axiosAuth.post("/notes", {
          title,
          content,
        });
        setNotes((prev) => [...prev, res.data]);
      }

      setTitle("");
      setContent("");
      setError("");
    } catch {
      setError("Failed to save note");
    }
  };

  // 🗑 Delete note
  const handleDeleteNote = async (id) => {
    await axiosAuth.delete(`/notes/${id}`);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-blue-500 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-9">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-purple-600">📝 My Notes</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}

        {/* Add / Edit Note */}
        <form onSubmit={handleAddNote} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border rounded p-2 h-24"
          />
          <button
            type="submit"
            className="bg-purple-500 text-white font-bold py-2 rounded"
          >
            {editId ? "💾 Update Note" : "➕ Add Note"}
          </button>
        </form>

        {/* Notes List */}
        <div className="mt-6 space-y-4">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note._id} className="bg-yellow-100 p-4 rounded shadow">
                <h3 className="font-bold">{note.title}</h3>
                <p>{note.content}</p>

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setEditId(note._id);
                      setTitle(note.title);
                      setContent(note.content);
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No notes available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
