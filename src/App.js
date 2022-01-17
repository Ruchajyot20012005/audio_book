import { useState, useEffect, createContext } from "react";
import Dexie from "dexie";
import Header from "./components/Header";
import "./App.css";
import { Container } from "@mui/material";
import SongFile from "./components/SongFile";

export const GlobleScope = createContext();

function App() {
  const db = new Dexie("myDatabase");
  db.version(1).stores({
    audioFiles: "id, title, file",
  });
  db.open().catch((err) => {
    console.log(err.stack || err);
  });

  const [fileTitle, setTitle] = useState("");
  const [uploadFile, setFile] = useState("");
  const [audioFiles, setAllFiles] = useState("");

  const getFile = (e) => {
    let reader = new FileReader();
    reader.readAsDataURL(e[0]);
    reader.onload = () => {
      setFile(reader.result);
    };
  };

  const getId = async (e) => {
    console.log(e);
    const temporaryId = e;
    db.audioFiles.delete(temporaryId);
    let allFiles = await db.audioFiles.toArray();
    setFile(allFiles);
  };

  const getFileInfo = (e) => {
    e.preventDefault();
    if (fileTitle !== "" && uploadFile !== "") {
      let uploadedFile = {
        title: fileTitle,
        file: uploadFile,
      };

      db.audioFiles.add(uploadedFile).then(async () => {
        let allFiles = await db.audioFiles.toArray();
        setAllFiles(allFiles);
      });
    }
  };

  useEffect(() => {
    const getFiles = async () => {
      let allFiles = await db.audioFiles.toArray();
      setAllFiles(allFiles);
    };
    getFiles();
  }, [uploadFile]);

  let fileData;

  if (audioFiles.length > 0) {
    fileData = (
      <>
        {audioFiles.map((item) => {
          return (
            <SongFile
              key={item.id}
              id={item.id}
              title={item.title}
              file={item.file}
              getID={getId}
            />
          );
        })}
      </>
    );
  } else {
    fileData = <div className="msg">No files uploaded</div>;
  }

  return (
    <div className="app">
      <Container className="container">
        <Header />
        <div className="main">
          <div className="form">
            <form onSubmit={getFileInfo}>
              <div className="title">
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Title"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
              </div>
              <div className="choose-file">
                <input
                  type="file"
                  name="file"
                  accept="audio/mp3,audio/*;capture=microphone"
                  onChange={(e) => {
                    getFile(e.target.files);
                  }}
                />
              </div>
              <div className="submit">
                <input type="submit" name="submit" placeholder="Upload" />
              </div>
            </form>
          </div>
          {fileData}
        </div>
      </Container>
    </div>
  );
}

export default App;
