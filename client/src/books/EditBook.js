import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { UserContext } from "../authentication/UserContext";

export default function BookEdit() {
  const { bookId } = useParams();
  const [title, setTitle] = useState(null);
  const [summary, setSummary] = useState(null);
  const [author, setAuthor] = useState(null);
  const [files, setFiles] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigator = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:4000/library/${bookId}`);
      if (response.status === 200) {
        const data = await response.json();
        setTitle(data.title);
        setSummary(data.summary);
        setAuthor(data.author);
      } else {
        alert("Could not fetch data!");
      }
    };

    fetchData();
  }, []);

  async function updateBook(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.set("title", title);
    formData.set("summary", summary);
    formData.set("author", author);
    formData.set("file", files?.[0]);

    const apiUrl = `http://localhost:4000/library/edit/${bookId}`;
    const request = {
      method: "PUT",
      body: formData,
      credentials: "include",
    };
    const response = await fetch(apiUrl, request);
    if (response.status === 200) {
      navigator(`/library/${bookId}`);
    } else {
      alert("Error updating the post!");
    }
  }

    return (
      <div>
        <h1>Edit details</h1>
        <form onSubmit={updateBook}>
          <input
            type="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="summary"
            placeholder="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <input
            type="text"
            placeholder="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <input type="file" onChange={(e) => setFiles(e.target.files)} />

          <button style={{ marginTop: "5px" }}>Update book information</button>
        </form>
      </div>
    );
}
