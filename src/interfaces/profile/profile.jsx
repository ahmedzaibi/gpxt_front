import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Layout from "../frontoffice/layout";

const Profile = () => {
  const [userData, setUserData] = useState({
    nudoss: "",
    userID: "",
    username: "",
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    matcle: "",
    soccle: "",
    language: "",
    roles : [],
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (nudoss) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/users/${nudoss}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const decoded = jwtDecode(token);
      const nudoss = decoded.Nudoss || "";
      await fetchUserData(nudoss);
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/users/updateUser/${userData.nudoss}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        await fetchUserData(userData.nudoss);
        setEditMode(false);
      } else {
        console.error("Failed to update user:", response.status);
        alert("Erreur lors de la mise à jour du profil.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <div
  className="flex items-center justify-center min-h-screen bg-cover bg-center pt-32"
  style={{ backgroundImage: `url('/images/bg_login.png')`,
    backgroundSize: 'cover',
    backgroundPosition: '90% 36%'
   }}
>

        <div className="relative w-full max-w-4xl px-6 py-20 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 text-white">
          {/* Avatar on top */}
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
            <img
              src="https://i.pravatar.cc/150"
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
            />
          </div>

          {/* Content inside the card */}
          <div className="mt-20 text-center">
            <h1 className="text-3xl font-bold mb-4">
              {editMode ? "Modifier Profil" : "Mon Profil"}
            </h1>

            {editMode ? (
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
                  {[
                    { label: "Username", key: "username" },
                    { label: "First Name", key: "firstname" },
                    { label: "Last Name", key: "lastname" },
                    { label: "Phone Number", key: "phonenumber" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block mb-1 text-white/80">{field.label}</label>
                      <input
                        type="text"
                        name={field.key}
                        value={userData[field.key]}
                        onChange={(e) =>
                          setUserData({ ...userData, [field.key]: e.target.value })
                        }
                        className="w-full p-2 rounded-md bg-white/20 text-white border border-white/30 focus:outline-none focus:ring focus:ring-blue-300"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-md"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
                  {[
                    { label: "First Name", key: "firstname" },
                    { label: "Last Name", key: "lastname" },
                    { label: "Username", key: "username" },
                    { label: "Phone Number", key: "phonenumber" },
                    { label: "Email", key: "email" },
                    { label: "Matcle", key: "matcle" },
                    { label: "Soccle", key: "soccle" },
                    { label: "Language", key: "language" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block mb-1 text-white/80">{field.label}</label>
                      <p className="bg-white/10 p-2 rounded-md">{userData[field.key]}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="bg-[#] btn btn-ghost px-4 py-2 rounded-md"
                  >
                    Modifier
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
