export default function UserList({ users, currentUser }) {
    return (
        <ul>
            {users.map((user, index) => (
                <li key={user.PublicId ?? user.publicId ?? user.id ?? user.email ?? index}>
                    {user.name} ({user.email}) [{String(user.role).toLowerCase() === 'admin' ? 'admin' : String(user.role).toLowerCase() === 'customer' ? 'customer' : 'normal'}]
                    {currentUser?.id === (user.PublicId ?? user.publicId ?? user.id) ? ' — You are logged in as this user' : ''}
                </li>
            ))}
        </ul>
    );
}