import { useEffect, useState } from 'react';
import ItemForm from './ItemForm';
import CategoryForm from './CategoryForm';
import { getFavourites, toggleFavourite as toggleFavouriteAPI } from '../../api/favouriteAPI';
import { getCart, addToCart as addToCartAPI } from '../../api/cartAPI';
import { getItems, postItem } from '../../api/itemAPI';
import { getCategories, createCategory as createCategoryAPI, deleteCategory as deleteCategoryAPI } from '../../api/categoryAPI';

const normalizeItem = (item) => ({
    id: item.id || item.publicId || item.PublicId || item.itemPublicId || item.ItemPublicId || null,
    title: item.title || item.name || item.Name || item.itemName || item.ItemName || 'Untitled',
    description: item.description || item.Description || '',
    author: item.author || item.Author || 'admin',
    createdAt: item.createdAt || item.CreatedAt || new Date().toISOString(),
});

const extractItemId = (item) => item?.id || item?.publicId || item?.PublicId || item?.itemPublicId || item?.ItemPublicId || null;

export default function ItemPage({ currentUser }) {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [favouriteIds, setFavouriteIds] = useState([]);
    const [cartItemIds, setCartItemIds] = useState([]);

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
                        ? favourites
                              .map((item) => extractItemId(item) || item)
                              .filter(Boolean)
                        : []
                );
            } catch (fetchError) {
                console.error(fetchError);
            }

            try {
                const cart = await getCart();
                setCartItemIds(
                    Array.isArray(cart)
                        ? cart.map((item) => extractItemId(item) || item).filter(Boolean)
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

        try {
            await toggleFavouriteAPI(itemId);
            setFavouriteIds((prev) =>
                prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
            );
        } catch (fetchError) {
            console.error(fetchError);
            setError('Failed to update favourite.');
        }
    };

    const addToCart = async (itemId) => {
        if (!currentUser) return;

        if (cartItemIds.includes(itemId)) return;

        try {
            await addToCartAPI(itemId);
            setCartItemIds((prev) => [...prev, itemId]);
        } catch (fetchError) {
            console.error(fetchError);
            setError('Failed to add item to cart.');
        }
    };

    const handleCreateItem = async (itemData) => {
        if (!currentUser || (currentUser.role !== 2 && currentUser.role?.toLowerCase() !== 'admin')) {
            setError('Only admin users can create items.');
            return;
        }

        try {
            setError(null);
            await postItem({ name: itemData.title, description: itemData.description, categoryName: itemData.categoryName });
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

    return (
        <div>
            <h2>Items</h2>
            {currentUser ? (
                <p>
                    Logged in as <strong>{currentUser.name}</strong> ({currentUser.role === 2 || currentUser.role?.toLowerCase?.() === 'admin' ? 'admin' : 'normal'})
                </p>
            ) : (
                <p>Please log in to see item creation controls.</p>
            )}

            {(currentUser?.role === 2 || currentUser?.role?.toLowerCase?.() === 'admin') ? (
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
            <ul>
                {items.map((item, index) => {
                    const itemId = item.id;
                    const isFavourited = favouriteIds.includes(itemId);
                    const isInCart = cartItemIds.includes(itemId);
                    return (
                        <li key={itemId ?? `${item.title}-${index}`}>
                            <strong>{item.title}</strong> — {item.description}
                            {currentUser && (
                                <div>
                                    <button onClick={() => toggleFavourite(itemId)}>
                                        {isFavourited ? 'Unlike' : 'Like'}
                                    </button>
                                    <button
                                        onClick={() => addToCart(itemId)}
                                        disabled={isInCart}
                                        style={{ marginLeft: '0.5rem' }}
                                    >
                                        {isInCart ? 'In Cart' : 'Add to Cart'}
                                    </button>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
