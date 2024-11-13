import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../services/AuthService";
import "./AdminPage.css";

const API_URL = "https://spotify-8vgb.onrender.com/api/songs";

const AdminPage = () => {
  const [songs, setSongs] = useState([]);
  const [newSong, setNewSong] = useState({
    name: "",
    singer: "",
    album: "",
    albumArtist: "",
    duration: "",
    lyrics: "",
    audioFile: "",
    avatar: "",
  });
  const [editingSong, setEditingSong] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(API_URL, {
          headers: { Authorization: token },
        });
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };
    fetchSongs();
  }, [navigate]);

  const handleAddSong = async () => {
    if (
      !newSong.name ||
      !newSong.singer ||
      !newSong.audioFile ||
      !newSong.avatar
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(API_URL, newSong, {
        headers: { "Content-Type": "application/json", Authorization: token },
      });
      setSongs([...songs, response.data]);
      setNewSong({
        name: "",
        singer: "",
        album: "",
        albumArtist: "",
        duration: "",
        lyrics: "",
        audioFile: "",
        avatar: "",
      });
    } catch (error) {
      console.error("Error adding song:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleEditSong = (song) => {
    setEditingSong(song);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/${editingSong._id}`,
        editingSong,
        {
          headers: { "Content-Type": "application/json", Authorization: token },
        }
      );
      setSongs(
        songs.map((song) =>
          song._id === editingSong._id ? response.data : song
        )
      );
      setEditingSong(null);
    } catch (error) {
      console.error("Error updating song:", error);
    }
  };

  const handleDeleteSong = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: token },
      });
      setSongs(songs.filter((song) => song._id !== id));
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <h1 className="title">Trang quản trị bài hát</h1>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "#e74c3c",
          color: "#fff",
          padding: "10px 22px",
          border: "none",
          borderRadius: "6px",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
          marginBottom: "10px",
        }}
      >
        Đăng xuất
      </button>
      <div className="form-container">
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Tên bài hát"
            value={newSong.name}
            onChange={(e) => setNewSong({ ...newSong, name: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Ca sĩ"
            value={newSong.singer}
            onChange={(e) => setNewSong({ ...newSong, singer: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Album"
            value={newSong.album}
            onChange={(e) => setNewSong({ ...newSong, album: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Nghệ sĩ album"
            value={newSong.albumArtist}
            onChange={(e) =>
              setNewSong({ ...newSong, albumArtist: e.target.value })
            }
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Thời lượng"
            value={newSong.duration}
            onChange={(e) => setNewSong({ ...newSong, duration: e.target.value })}
          />
          <textarea
            className="form-control"
            placeholder="Lời bài hát"
            value={newSong.lyrics}
            onChange={(e) => setNewSong({ ...newSong, lyrics: e.target.value })}
          ></textarea>
          <input
            type="text"
            className="form-control"
            placeholder="File âm thanh URL"
            value={newSong.audioFile}
            onChange={(e) =>
              setNewSong({ ...newSong, audioFile: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control"
            placeholder="Avatar URL"
            value={newSong.avatar}
            onChange={(e) => setNewSong({ ...newSong, avatar: e.target.value })}
          />
          <button className="btn btn-primary" onClick={handleAddSong}>
            Thêm bài hát
          </button>
        </div>
      </div>

      <div className="product-list">
        {songs.map((song) => (
          <div className="product-card" key={song._id}>
            {editingSong && editingSong._id === song._id ? (
              <>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tên bài hát"
                  value={editingSong.name}
                  onChange={(e) =>
                    setEditingSong({
                      ...editingSong,
                      name: e.target.value,
                    })
                  }
                />
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ca sĩ"
                      value={editingSong.singer}
                      onChange={(e) =>
                        setEditingSong({
                          ...editingSong,
                          singer: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Album"
                      value={editingSong.album}
                      onChange={(e) =>
                        setEditingSong({
                          ...editingSong,
                          album: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nghệ sĩ album"
                      value={editingSong.albumArtist}
                      onChange={(e) =>
                        setEditingSong({
                          ...editingSong,
                          albumArtist: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Thời lượng"
                      value={editingSong.duration}
                      onChange={(e) =>
                        setEditingSong({
                          ...editingSong,
                          duration: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <textarea
                  className="form-control"
                  placeholder="Lời bài hát"
                  value={editingSong.lyrics}
                  onChange={(e) =>
                    setEditingSong({
                      ...editingSong,
                      lyrics: e.target.value,
                    })
                  }
                ></textarea>
                <input
                  type="text"
                  className="form-control"
                  placeholder="File âm thanh URL"
                  value={editingSong.audioFile}
                  onChange={(e) =>
                    setEditingSong({
                      ...editingSong,
                      audioFile: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Avatar URL"
                  value={editingSong.avatar}
                  onChange={(e) =>
                    setEditingSong({
                      ...editingSong,
                      avatar: e.target.value,
                    })
                  }
                />
                <div className="btn-group">
                  <button className="btn btn-primary" onClick={handleSaveEdit}>
                    Lưu
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => setEditingSong(null)}
                  >
                    Hủy
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="product-name">{song.name}</h3>
                <p className="product-description">Ca sĩ: {song.singer}</p>
                <p className="product-description">Album: {song.album}</p>
                <p className="product-description">
                  Nghệ sĩ album: {song.albumArtist}
                </p>
                <p className="product-description">
                  Thời lượng: {song.duration}
                </p>
                <div className="btn-group">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditSong(song)}
                  >
                    Cập nhật
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteSong(song._id)}
                  >
                    Xóa
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;