import './App.css';
import extensionsData from './extensions.json';

function Card({ title, content }) {
  return (
    <div className="col-md-3 mb-4">
      <div className="card">
        <h5 className="card-header">
          {title}
        </h5>
        <div className="card-body">
          <h4 className="card-text">
            {content}
          </h4>
          <p className="card-text">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

function CardRow({ cards }) {
  return (
    <div className="row justify-content-center">
      {cards.map((card, index) => (
        <Card key={index} title={card.title} content={card.content} />
      ))}
    </div>
  );
}

function App() {
  

  // Générer des lignes de cartes
  const cardRows = [];
  for (let i = 0; i < extensionsData.length; i += 3) {
    cardRows.push(extensionsData.slice(i, i + 3));
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
          <br />
            <h1 className="text-center" style={{ fontWeight: "500" }}>
              NuclearMod Extension Gallery
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
  );
}

export default App;
