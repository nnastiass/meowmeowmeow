export default function UserList({ users, currentUser }) {
    return (
        <ul>
            {users.map((user, index) => (
                <li key={user.id ?? user.email ?? index}>
                    {user.name} ({user.email}) [{user.role === 2 ? 'admin' : 'normal'}]
                    {currentUser?.id === user.id ? ' — You are logged in as this user' : ''}
                </li>
            ))}
        </ul>
    );
}