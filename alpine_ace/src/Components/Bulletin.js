import { useState, useEffect } from "react";

const Bulletin = () => {
    const [bulletins, setBulletins] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async()=>{
            setLoading(true);
            try{
                const response = await fetch("http://localhost:5000/api/bulletins");
                if (!response.ok){
                    throw new Error("something went wrong");
                }
                const data = await response.json();
                setBulletins(data);
                setLoading(false);
            } catch(error) {
                console.error("Error fetching bulletin data", error);
                setError("Error fetching bulletins data. Please try again.");
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const  LevelIconMap = {
        "low": "bulletin_icons/gering.png",
        "moderate": "bulletin_icons/massig.png",
        "considerable": "/bulletin_icons/erheblich.png",
        "high": "bulletin_icons/gross.png",
        "very_high":"bulletin_icons/sehr_gross.png",
        "no_snow": "bulletin_icons/keine.png", 
        "no_rating":  "bulletin_icons/keine.png"
    };


    
 

    return (
        <div> 
      
          {bulletins && bulletins.map((bulletin) => (
            <div key={bulletin.id}>
                <img 
                src={LevelIconMap[bulletin.b_danger]} 
                alt={`Avalanche Danger Level ${bulletin.b_danger}`} 
                style={{ display: "block", margin: "0 auto", width: "20px" }} 
                />
                <p style={{ textAlign: "center", fontWeight: "bold", color: "#00112e" }}>
                {bulletin.b_danger} 
                </p>
            </div>
          ))}
        </div>
      );
      
};
export default Bulletin;