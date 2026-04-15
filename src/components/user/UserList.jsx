export default function UserList({ users, currentUser }) {
    return (
        <ul>
            {users.map((user, index) => (
                <li key={user.PublicId ?? user.publicId ?? user.id ?? user.email ?? index}>
                    {(user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()) || user.email} ({user.email}) [{user.role === 2 ? 'admin' : user.role === 1 ? 'customer' : 'normal'}]
                    {currentUser?.id === (user.PublicId ?? user.publicId ?? user.id) ? ' — You are logged in as this user' : ''}
                </li>
            ))}
        </ul>
    );
}