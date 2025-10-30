import { User } from "@/types/user";

type Props = {
  users: User[];
};

export const UserTable = ({ users }: Props) => {
  console.log("UserTable received users:", users);

  return (
    <main className="flex flex-col px-4 py-2 w-full">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      {users && users.length > 0 ? (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-stone-300 text-stone-500">
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Auth0 ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-stone-300 text-sm">
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role || "N/A"}</td>
                <td className="p-2">{user.auth0Id || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
    </main>
  );
};
