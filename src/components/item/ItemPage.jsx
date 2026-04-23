import { useEffect, useState } from 'react';
import ItemForm from './ItemForm';
import CategoryForm from './CategoryForm';
import { 
    getFavourites, 
    toggleFavourite as toggleFavouriteAPI, 
    removeFavourite as removeFavouriteAPI 
} from '../../api/favouriteAPI';
import { getCart, addToCart as addToCartAPI } from '../../api/cartAPI';
import { getItems, postItem, deleteItem } from '../../api/itemAPI';
import { getCategories, createCategory as createCategoryAPI, deleteCategory as deleteCategoryAPI } from '../../api/categoryAPI';


const normalizeItem = (item) => ({
    id: item.id || item.publicId || item.PublicId || item.itemPublicId || item.ItemPublicId || null,
    title: item.title || item.name || item.Name || item.itemName || item.ItemName || 'Untitled',
    description: item.description || item.Description || '',
    author: item.author || item.Author || 'admin',
    createdAt: item.createdAt || item.CreatedAt || new Date().toISOString(),
    categoryId: item.categoryId || item.CategoryId || null, 
});
const extractItemId = (item) => item?.itemPublicId || item?.ItemPublicId || item?.id || item?.publicId || item?.PublicId || null;

export default function ItemPage({ currentUser }) {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [favouriteIds, setFavouriteIds] = useState([]);
    const [cartItemIds, setCartItemIds] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategoryId, setFilterCategoryId] = useState('');

    const isAdmin = currentUser && (currentUser.role === 2 || (typeof currentUser.role === 'string' && currentUser.role.toLowerCase() === 'admin'));

    useEffect(() => {
        console.log('Current user:', currentUser);
    }, [currentUser]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getCategories();
                setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
            } catch (fetchError) {
                console.error(fetchError);
                console.warn('Could not load categories');
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const fetchedItems = await getItems();
                setItems(Array.isArray(fetchedItems) ? fetchedItems.map(normalizeItem) : []);
            } catch (fetchError) {
                console.error(fetchError);
                setError('Failed to load items.');
            }
        };
        fetchItems();
    }, []);

    useEffect(() => {
        const refreshLists = async () => {
            if (!currentUser) {
                setFavouriteIds([]);
                setCartItemIds([]);
                return;
            }

            try {
                const favourites = await getFavourites();
                setFavouriteIds(
                    Array.isArray(favourites)
                        ? favourites.map((item) => extractItemId(item) || item).filter(Boolean)
                        : []
                );
            } catch (fetchError) {
                console.error(fetchError);
            }

            try {
                const cartData = await getCart();
                setCartItemIds(
                    cartData && Array.isArray(cartData.items)
                        ? cartData.items.map((item) => extractItemId(item) || item).filter(Boolean)
                        : []
                );
            } catch (fetchError) {
                console.error(fetchError);
            }
        };

        refreshLists();
    }, [currentUser]);

    const toggleFavourite = async (itemId) => {
        if (!currentUser) return;
        const isCurrentlyFavourited = favouriteIds.includes(itemId);

        try {
            if (isCurrentlyFavourited) {
                await removeFavouriteAPI(itemId);
                setFavouriteIds((prev) => prev.filter((id) => id !== itemId));
            } else {
                await toggleFavouriteAPI(itemId);
                setFavouriteIds((prev) => [...prev, itemId]);
            }
        } catch (fetchError) {
            console.error(fetchError);
            setError('Failed to update favourite.');
        }
    };

    const addToCart = async (itemId) => {
        if (!currentUser) return;
        try {
            await addToCartAPI(itemId);
            setCartItemIds((prev) => [...prev, itemId]);
        } catch (fetchError) {
            console.error(fetchError);
            setError('Failed to add item to cart.');
        }
    };

    const handleCreateItem = async (itemData) => {
        if (!isAdmin) {
            setError('Only admin users can create items.');
            return;
        }

        try {
            setError(null);
            await postItem(itemData); 
            const fetchedItems = await getItems();
            setItems(Array.isArray(fetchedItems) ? fetchedItems.map(normalizeItem) : []);
        } catch (fetchError) {
            console.error(fetchError);
            setError('Failed to create item.');
        }
    };

    const handleCreateCategory = async (categoryData) => {
        try {
            await createCategoryAPI(categoryData);
            const fetchedCategories = await getCategories();
            setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
        } catch (categoryError) {
            console.error(categoryError);
            setError('Failed to create category.');
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await deleteCategoryAPI(categoryId);
            const fetchedCategories = await getCategories();
            setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
        } catch (categoryError) {
            console.error(categoryError);
            setError('Failed to delete category.');
        }
    };

    const handleDeleteItem = async (itemId) => {

        if (!isAdmin) {
            setError('Only admin users can delete items.');
            return;
        }

        if (!window.confirm("Are you sure you want to permanently delete this item?")) {
            return; 
        }

        try {
            await deleteItem(itemId);
            setItems((prev) => prev.filter((item) => item.id !== itemId));
        } catch (fetchError) {
            console.error(fetchError);
            setError('Failed to delete item.');
        }
    };

    const filteredItems = items.filter(item => {
        const itemTitle = typeof item.title === 'string' ? item.title.toLowerCase() : '';
        const query = typeof searchQuery === 'string' ? searchQuery.toLowerCase() : '';
        const matchesSearch = itemTitle.includes(query);
        const matchesCategory = filterCategoryId ? item.categoryId === filterCategoryId : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <h2>Items</h2>
            {currentUser ? (
                <p>
                    Logged in as <strong>{currentUser.name}</strong> ({isAdmin ? 'admin' : 'normal'})
                </p>
            ) : (
                <p>Please log in to see item creation controls.</p>
            )}

            {(isAdmin) ? (
                <div>
                    <h3>Manage Categories</h3>
                    <CategoryForm onCreate={handleCreateCategory} />
                    {categories.length > 0 && (
                        <div>
                            <h4>Existing Categories</h4>
                            <ul>
                                {categories.map((cat, idx) => (
                                    <li key={cat.publicId ?? cat.PublicId ?? idx}>
                                        <strong>{cat.name ?? cat.Name}</strong> — {cat.description ?? cat.Description}
                                        <button
                                            onClick={() => handleDeleteCategory(cat.publicId ?? cat.PublicId)}
                                            style={{ marginLeft: '0.5rem' }}
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <h3>Create Item</h3>
                    <ItemForm onCreate={handleCreateItem} categories={categories} />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            ) : (
                <p style={{ color: currentUser ? 'black' : 'gray' }}>
                    {currentUser ? 'Only admins can create new items.' : 'Log in as an admin to create items.'}
                </p>
            )}

            <h3>Item List</h3>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <input 
                    type="text" 
                    placeholder="Search items by name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '0.5rem', flex: 1 }}
                />
                
                <select 
                    value={filterCategoryId} 
                    onChange={(e) => setFilterCategoryId(e.target.value)}
                    style={{ padding: '0.5rem' }}
                >
                    <option value="">All Categories</option>
                    {categories.map((cat, idx) => {
                        const catId = cat.publicId ?? cat.PublicId;
                        const catName = cat.name ?? cat.Name;
                        return (
                            <option key={catId ?? idx} value={catId}>
                                {catName}
                            </option>
                        );
                    })}
                </select>
            </div>

            {filteredItems.length === 0 ? (
                <p>No items found matching your criteria.</p>
            ) : (
                <ul>
                    {filteredItems.map((item, index) => {
                        const itemId = item.id;
                        const isFavourited = favouriteIds.includes(itemId);
                        const isInCart = cartItemIds.includes(itemId);
                        return (
                            <li key={itemId ?? `${item.title}-${index}`}>
                                <strong>{item.title}</strong> — {item.description}
                                {currentUser && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        {!isFavourited && (
                                            <button onClick={() => toggleFavourite(itemId)}>
                                                Like
                                            </button>
                                        )}
                                        <button
                                            onClick={() => addToCart(itemId)}
                                            style={{ marginLeft: '0.5rem' }}
                                        >
                                            {isInCart ? 'Add Another to Cart' : 'Add to Cart'}
                                        </button>
                                        {(isAdmin) && (
                                            <button 
                                                onClick={() => handleDeleteItem(itemId)}
                                                style={{ marginLeft: '1rem', backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '2px 8px', borderRadius: '4px' }}
                                            >
                                                Delete Item
                                            </button>
                                        )}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}