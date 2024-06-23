import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './App.css';
import defaultExt from './default_ext.png';
import nuclearmodLogo from './nuclearmod.png';
import Doc from "./pages/doc";
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

const editor = "https://nuclearmod.github.io/editor/editor.html";
let root; 

if (window.location.hostname.endsWith('localhost')) {
  root = `${window.location.origin}${process.env.PUBLIC_URL}/`;
} else {root = `${window.location.origin}${window.location.pathname}`;}



function ExtPage() {
  const [extensionsData, setExtensionsData] = useState([]);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/extensions.json`)
      .then((response) => response.json())
      .then((data) => setExtensionsData(data))
      .catch((error) => console.error('Error fetching the extensions data:', error));
  }, []);

    // Générer des lignes de cartes
    const cardRows = [];
    for (let i = 0; i < extensionsData.length; i += 3) {
      cardRows.push(extensionsData.slice(i, i + 3));
    }
  function Card({ name, desc, img, src, project, credits, credits_url, doc }) {
    const [imageSrc, setImageSrc] = useState(defaultExt);
  
    useEffect(() => {
      const imgToLoad = new Image();
      imgToLoad.src = `${process.env.PUBLIC_URL}/images/${img}`;
      imgToLoad.onload = () => setImageSrc(imgToLoad.src);
      imgToLoad.onerror = () => setImageSrc(defaultExt);
    }, [img]);
  
    const copyToClipboard = () => {
      const url = `${root}extensions/${src}`;
      navigator.clipboard.writeText(url).then(() => {
        console.log('URL copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy URL: ', err);
      });
    };
  
    const openExt = () => {
      const url = `${editor}?extension=${root}extensions/${src}`;
      window.open(url, '_blank');
    };
  
    const openSampleProject = () => {
      const url = `${editor}?project_url=${root}samples/${project}.sb3`;
      window.open(url, '_blank');
    };
    const openDoc = () => {
      const url = `/extensions/#/${doc}`;
      window.open(url, '_blank');
    };
  
    return (
      <div className="col-8 col-sm-8 col-md-6 col-lg-4 col-xl-3 mb-4 fixed-size-card">
        <div className="card">
          <div className="card-header btn-in-card fixed-size-header" style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="btn-wrapper">
              <button className="btn btn-primary" onClick={copyToClipboard}>
                Copy URL
              </button>
              <button className="btn btn-danger" onClick={openExt}>
                Open Extension
              </button>
              {project && (
                <button className="btn btn-success" onClick={openSampleProject}>
                  Sample Project
                </button>
              )}
              {doc && (
                <button className="btn btn-warning text-light" onClick={openDoc}>
                  Documentation
                </button>
              )}
            </div>
          </div>
          <div className="card-body">
            <h4 className="card-text">
              <strong>{name}</strong>
            </h4>
            <p className="card-text">
              {desc}
            </p>
            {credits && credits_url ? (
              <a href={credits_url}>by {credits}</a>
            ) : credits ? (
              <div>by {credits}</div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
  
  function CardRow({ cards }) {
    return (
      <div className="row justify-content-center">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <br />
            <h1 className="text-center" style={{ fontWeight: "500" }}>
              <img src={nuclearmodLogo} alt="logo" style={{ width: "70px", marginRight: "10px"}}/>NuclearMod Extension Gallery
            </h1>
          </div>
        </div>
      </div>
      <div className="container">
        <br />
        {cardRows.map((row, index) => (
          <CardRow key={index} cards={row} />
        ))}
      </div>
    </div>
  )
}

const Err404 = () => {
  return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <center><h1>404 - Page not found</h1></center>
      </div>
  );
};

function App() {
  return (
    <Router basename="extensions">
      <Routes>
        <Route path="/" element={<ExtPage />} />
        <Route path=":docId" element={<Doc />} />
        <Route path="*" element={<Err404 />} />
      </Routes>
    </Router>
  );
}

export default App;
