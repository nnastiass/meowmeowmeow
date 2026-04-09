import { useEffect, useState } from "react";
import { getFavourites } from "../../api/favouriteAPI";

export default function FavouritesPage() {
    const [favs, setFavs] = useState([]);

    useEffect(() => {
        getFavourites()
            .then(data => {
                if (Array.isArray(data)) {
                    setFavs(data);
                } else {
                    console.error("Received data is not an array:", data);
                    setFavs([]);
                }
            })
            .catch(err => {
                console.error("Failed to fetch favourites:", err);
                setFavs([]);
            });
    }, []);

    return (
        <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '40px 20px' }}>
            <h2 style={{ 
                textAlign: 'center', 
                fontSize: '2.5rem', 
                textTransform: 'uppercase', 
                letterSpacing: '4px',
                color: '#000',
                marginBottom: '40px',
                borderBottom: '5px solid #ff0000',
                paddingBottom: '10px'
            }}>
                Your Favourites
            </h2>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '30px' 
            }}>
                {Array.isArray(favs) && favs.length > 0 ? (
                    favs.map(item => (
                        <div key={item.publicId} style={{ 
                            border: '3px solid #000', 
                            padding: '25px', 
                            backgroundColor: '#000', 
                            color: '#fff',
                            boxShadow: '10px 10px 0px #ff0000', 
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '0',
                                right: '0',
                                backgroundColor: '#ff0000',
                                color: '#fff',
                                padding: '5px 15px',
                                fontWeight: 'bold',
                                fontSize: '0.8rem'
                            }}>
                                SAVED
                            </div>

                            <h3 style={{ 
                                textTransform: 'uppercase', 
                                margin: '0 0 10px 0', 
                                letterSpacing: '1px',
                                borderLeft: '5px solid #ff0000',
                                paddingLeft: '15px'
                            }}>
                                {item.name}
                            </h3>
                            
                            <p style={{ 
                                fontSize: '1.5rem', 
                                fontWeight: '900', 
                                color: '#ff0000', 
                                margin: '20px 0 0 0' 
                            }}>
                                €{item.price}
                            </p>
                        </div>
                    ))
                ) : (
                    <div style={{ 
                        gridColumn: '1 / -1', 
                        textAlign: 'center', 
                        padding: '60px', 
                        border: '2px dashed #000',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Nothing here yet. Give some love to items pls they deserve it
                        </p>

                    </div>
                )}
            </div>
        </div>
    );
}