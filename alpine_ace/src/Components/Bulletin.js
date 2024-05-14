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
        "low": "%PUBLIC_URL%/bulletin_icon/gering.png",
        "moderate": "./bulletin_icon/massig.png",
        "considerable": "./bulletin_icon/erheblich.png",
        "high": "./bulletin_icon/gross.png",
        "very_high":"/bulletin_icon/sehr_gross.png",
        "no_snow": "./bulletin_icon/keine.png", 
        "no_rating":  "./bulletin_icon/keine.png"
    };

    const TextMap ={
        "low": "gering",
        "moderate": "mässig",
        "considerable": "erheblich",
        "high": "gross",
        "very_high": "sehr gross",
        "no_snow": "keine",
        "no_rating": "keine"
    }
    
   
 
    return (
        <div> 
            {loading && <p>Loading Avalanche...</p>}
            {error && <p>{error}</p>}
            <item>
                {bulletins && bulletins.map((bulletin) => (
                    <div >
                        <img 
                        // src={LevelIconMap[bulletin.b_danger]} 
                        // src={require(`${LevelIconMap[bulletin.b_danger]}`)}
                        src={"%PUBLIC_URL%/bulletin_icon/gering.png"}
                        alt={`Avalanche Danger Lever ${bulletin.b_danger}`} 
                        style={{ maxWidth: "10vh", display: "block", margin: "0 auto"}} 
                        />
                        <p style={{ textAlign: "center", fontWeight: "bold", color: "#00112e" }}>
                        {TextMap[bulletin.b_danger]} 
                        </p>
                    </div>
                ))}
            </item>
        </div>
      );
      
};
export default Bulletin;