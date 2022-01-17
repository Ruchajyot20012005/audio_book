import React from "react";
import "./SongFile.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

function SongFile({ title, file, id, getID }) {
  return (
    <div key={id} className="song-file">
      <div className="title">{title}</div>
      <div className="options">
        <div className="palyer">
          <audio controls src={`${file}`}></audio>
        </div>
        <div className="delete">
          <DeleteForeverIcon onClick={() => getID(id)} />
        </div>
      </div>
    </div>
  );
}

export default SongFile;
