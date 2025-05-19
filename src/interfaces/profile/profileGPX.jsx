import React, { useEffect, useState } from "react";
import Layout from "../frontoffice/layout";

const ProfileGPX = () => {
  const [userData, setUserData] = useState({
    nudoss: "",
    userID: "",
    name: "",
    language: "",
    roles: [],
    hasPhoto: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedData = JSON.parse(localStorage.getItem("data"));
      console.log("Stored data:", storedData);

      const userDescription = storedData;
      setUserData((prev) => ({
        ...prev,
        nudoss: userDescription?.nudoss || "0",
        userID: userDescription?.userID || "",
        name: userDescription?.name || "",
        language: userDescription?.language || "",
        roles: userDescription?.roles || [],
        hasPhoto: userDescription?.hasPhoto || "",
      }));

      setLoading(false);
    };
    loadUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center pt-32"
        style={{
          backgroundImage: `url('/images/bg_login.png')`,
          backgroundSize: "cover",
          backgroundPosition: "90% 36%",
        }}
      >
        <div className="relative w-full max-w-4xl px-6 py-20 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 text-white">
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
            <img
              src={"https://i.pravatar.cc/150"}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
            />
          </div>
          <div className="mt-20 text-center">
            <h1 className="text-3xl font-bold mb-4">Mon Profil</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
              {[
                { label: "Nudoss", key: "nudoss" },
                { label: "UserID", key: "userID" },
                { label: "Nom", key: "name" },
                { label: "Language", key: "language" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block mb-1 text-white/80">
                    {field.label}
                  </label>
                  <p className="bg-white/10 p-2 rounded-md">
                    {userData[field.key] || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileGPX;
