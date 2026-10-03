import { useEffect, useState } from "react";

function App() {
    const [message, setMessage] = useState("Connecting to the castle...");

    useEffect(() => {
        fetch("http://localhost:5000/api/health")
            .then((response) => response.json())
            .then((data) => {
                setMessage(data.message);
            })
            .catch((error) => {
                console.error(error);
                setMessage("Could not reach the castle server 🏰");
            });
    }, []);

    return (
        <div>
            <h1>Hotel Transylvania 🦇</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;