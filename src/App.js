import './App.css';
import { useState, useEffect } from 'react';
import RenderGrid from './components/RenderGrid';

const getData = async () => {
  try {
    const url = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return [];
  }
}

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getData()
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);


  useEffect(() => {
    console.log("data changed", data);
    if (data.length === 0) return;
    setLoading(false);
  }, [data])



  return (
    <div className="App">
      <header className="App-header">
        <h1>Admin UI</h1>
        {loading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : <RenderGrid data={data} />}
      </header>
    </div>
  );
}

export default App;
