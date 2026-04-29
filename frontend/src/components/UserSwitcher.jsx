export default function UserSwitcher({ users, currentUser, onChange }) {
  return (
    <select
      value={currentUser?.id}
      onChange={(e) => {
        const selected = users.find(u => u.id === Number(e.target.value));
        onChange(selected);
      }}
    >
      {users.map(user => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
}