import { useEffect, useState } from 'react';
import { getFavourites, removeFavourite as removeFavouriteAPI } from '../../api/favouriteAPI';

const normalizeFavouriteItem = (item) => ({
    id: item.itemPublicId || item.ItemPublicId || item.publicId || item.PublicId || null,
    title: item.itemName || item.ItemName || item.title || item.name || 'Untitled',
    price: item.itemPrice || item.ItemPrice || 0, 
});

export default function FavouritePage({ currentUser }) {
    const [favourites, setFavourites] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadFavourites = async () => {
            if (!currentUser) {
                setFavourites([]);
                return;
            }

            try {
                const favouritesFromApi = await getFavourites();
                if (Array.isArray(favouritesFromApi)) {
                    setFavourites(favouritesFromApi.map(normalizeFavouriteItem));
                } else {
                    setFavourites([]);
                }
            } catch (fetchError) {
                console.error(fetchError);
                setError('Failed to load favourites.');
            }
        };

        loadFavourites();
    }, [currentUser]);

    const removeFavourite = async (itemId) => {
    if (!currentUser) return;

    try {
        await removeFavouriteAPI(itemId);
        
        setFavourites((prev) => prev.filter((item) => item.id !== itemId));
    } catch (fetchError) {
        console.error(fetchError);
        setError('Could not update favourites.');
    }
};

    if (!currentUser) {
        return <p>Please log in to view your favourites.</p>;
    }

    return (
        <div>
            <h2>Favourites</h2>
            <p>
                Logged in as <strong>{currentUser.name}</strong> ({currentUser.role === 2 ? 'admin' : 'normal'})
            </p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {favourites.length === 0 ? (
                <p>You have no favourites yet.</p>
            ) : (
                <ul>
                    {favourites.map((item, idx) => (
                        <li key={item.id ?? `${item.title}-${idx}`}>
                            <strong>{item.title}</strong> — ${item.price.toFixed(2)}
                            
                            <button style={{ marginLeft: '0.5rem' }} onClick={() => removeFavourite(item.id)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}