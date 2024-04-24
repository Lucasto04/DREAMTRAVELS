import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from 'react-router-dom';

import "./App.css";
import Login from "./components/Login";



function TravelList({ onEdit, onDelete }) {
  const [travels, setTravels] = useState([]);

  useEffect(() => {
    async function fetchTravels() {
      try {
        const response = await fetch('http://localhost:3000/viaggi', { method: 'GET' });
        const data = await response.json();
        setTravels(data);
      } catch (error) {
        console.error("Errore nel caricamento dei viaggi:", error);
      }
    }
    fetchTravels();
  }, []);

  return (
    <div className='lista-viaggi'>
      <h1>Lista Viaggi</h1>
      <div className="travel-list">
        {travels.map((travel) => (
          <div key={travel._id} className="travel-card">
            <h2>{travel.localita}</h2>
            <p> {travel.durata}</p>
            <p> {travel.description}</p>
            <p><strong>Budget:</strong>{travel.budget}€</p>
            <br/>
            <div>
              <button onClick={() => onEdit(travel)}>Modifica</button>
              <button onClick={() => onDelete(travel._id)}>Cancella</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TravelForm({ onSubmit, travel }) {
  const [localita, setLocalita] = useState('');
  const [durata, setDurata] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [travelId, setTravelId] = useState('');


  useEffect(() => {
    if (travel) {
      setLocalita(travel.localita);
      setDurata(travel.durata);
      setDescription(travel.description);
      setBudget(travel.budget);
      setTravelId(travel._id);
    }
  }, [travel]);

const handleSubmit = async (e) => {
  e.preventDefault();
  const method = travelId ? 'PUT' : 'POST';
  const url = travelId ? `http://localhost:3000/viaggi/${travelId}` : 'http://localhost:3000/viaggi';

  const body = JSON.stringify({ localita, durata, description, budget });

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body
    });
    if (response.ok) {
      onSubmit();
      alert(travelId ? 'Viaggio modificato con successo!' : 'Viaggio aggiunto con successo!');
    } else {
      const data = await response.json();
      throw new Error(data.message || 'Errore nella richiesta');
    }
  } catch (error) {
    console.error("Errore durante l'operazione:", error.message);
    alert(error.message);
  }
};

  return (
    <div className='add-edit-form'>
      <h1>{travelId ? 'Modifica Viaggio' : 'Aggiungi Viaggio'}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Località" value={localita} onChange={e => setLocalita(e.target.value)} />
        <input type="text" placeholder="Durata" value={durata} onChange={e => setDurata(e.target.value)} />
        <input type="text" placeholder="Descrizione" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="text" placeholder="Budget" value={budget} onChange={e => setBudget(e.target.value)} />
        <button type="submit">{travelId ? 'Modifica' : 'Aggiungi'}</button>
      </form>
    </div>
  );
}



function Homepage() {
  const [currentTravel, setCurrentTravel] = useState(null);
  const navigate = useNavigate();

  const refreshTravels = () => {
    setCurrentTravel(null); 
  };

  const handleEdit = (travel) => {
    setCurrentTravel(travel); 
  };

  const handleDelete = async (travelId) => {
    try {
      const response = await fetch(`http://localhost:3000/viaggi/${travelId}`, { method: 'DELETE' });
      if (response.ok) {
        refreshTravels(); 
      } else {
        console.error('Errore nella cancellazione del viaggio');
      }
    } catch (error) {
      console.error("Errore nell'eliminazione del viaggio:", error);
    }
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar-title">App Viaggi</div>  
        <ul className="navbar-links">
          <li><button >Logout</button></li> 
        </ul>
      </div>

      <TravelForm onSubmit={refreshTravels} travel={currentTravel} />
      <TravelList travels={currentTravel ? [currentTravel] : []} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch('http://localhost:3000/session', { credentials: 'include' });
      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };



  return (
    <Router>
      <div className='App'>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/homepage" element={<Homepage />} />
              <Route path="*" element={<Navigate replace to="/homepage" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate replace to="/login" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;