import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './App.css';
import defaultExt from './default_ext.png';
import nuclearmodLogo from './nuclearmod.png';
import Doc from "./pages/doc";
import { ThemeProvider, useTheme } from './ThemeContext';
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
  const [searchTerm, setSearchTerm] = useState(''); // Add state for search term
  const { theme } = useTheme();

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/extensions.json`)
      .then((response) => response.json())
      .then((data) => setExtensionsData(data))
      .catch((error) => console.error('Error fetching the extensions data:', error));
  }, []);

  // Filter extensions based on search term
  const filteredExtensions = extensionsData.filter(extension =>
    extension.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate rows of cards
  const cardRows = [];
  for (let i = 0; i < filteredExtensions.length; i += 3) {
    cardRows.push(filteredExtensions.slice(i, i + 3));
  }

  function Card({ name, desc, img, src, project, credits, credits_url, doc, info }) {
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

    const popover = (
      <Popover id="popover-trigger-focus" title={name} style={{borderRadius: '5px', padding: '10px'}} data-bs-theme={theme}>
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <div dangerouslySetInnerHTML={{ __html: `${info}` }} />
            </div>
          </div>
        </div>
      </Popover>
    );

    return (
      <div className="col-8 col-sm-8 col-md-6 col-lg-4 col-xl-3 mb-4 fixed-size-card" data-bs-theme={theme}>
        <div className="card">
          <div className="card-header btn-in-card fixed-size-header" style={{ backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {info && (
              <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={popover}>
                <Button variant="secondary" className="btn-sm btn-wrapper" style={{top: '1.5em', left: '1.5em', borderRadius: '15px', width: '25px', height: '25px', fontFamily: 'Times New Roman'}}>
                  <strong><em>i</em></strong>
                </Button>
              </OverlayTrigger>
            )}
            <div className="btn-wrapper">
              <Button variant="primary" onClick={copyToClipboard}>
                Copy URL
              </Button>
              <Button variant="danger" onClick={openExt}>
                Open Extension
              </Button>
              {project && (
                <Button variant="success" onClick={openSampleProject}>
                  Sample Project
                </Button>
              )}
              {doc && (
                <Button variant="warning" onClick={openDoc} style={{color: 'white'}}>
                  Documentation
                </Button>
              )}
            </div>
          </div>
          <div className="card-body" style={{ backgroundColor: theme === 'dark' ? '#131313' : '#FFF', color: theme === 'dark' ? 'white' : 'black'}}>
            <h4 className="card-text">
              <strong>{name}</strong>
            </h4>
            <p className="card-text">
            <div dangerouslySetInnerHTML={{ __html: `${desc}` }} />
            </p>
            {credits && credits_url ? (
              <div>by <a href={credits_url}>{credits}</a></div>
            ) : credits ? (
              <div dangerouslySetInnerHTML={{ __html: `by ${credits}` }} />
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
        {/* Search bar */}
        <br/>
        <div className="row justify-content-center">
          <div className="col-8">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search extensions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              data-bs-theme={theme}
            />
          </div>
        </div>
      </div>
      <br/>
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
    <ThemeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<ExtPage />} />
        <Route path=":docId" element={<Doc />} />
        <Route path=":folderDoc/:docId" element={<Doc />} />
        <Route path="*" element={<Err404 />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
