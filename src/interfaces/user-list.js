import { useEffect, useState } from "react";
import BLayout from "./backoffice/blayout";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/users/getAllUsers")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <BLayout>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-white">
          Liste des Utilisateurs
        </h1>

        {users.length === 0 ? (
          <div className="text-center text-gray-300 mt-10">
            Aucun utilisateur trouvé.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {users.map((user, index) => (
              <div
                key={index}
                className="card bg-gray-800 shadow-xl text-white border border-gray-700"
              >
                <div className="card-body">
                  <div className="flex items-center mb-3">
                    <UserCircleIcon className="h-10 w-10 text-yellow-400 mr-3" />
                    <h2 className="card-title text-lg">{user.name}</h2>
                  </div>
                  <p>
                    <span className="font-semibold">Username:</span>{" "}
                    {user.username}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {user.email || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Roles:</span>
                  </p>
                  <ul className="list-disc list-inside text-sm">
                    {user.roles?.map((role, i) => (
                      <li key={i}>{role.label || role.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BLayout>
  );
};

export default UserList;
