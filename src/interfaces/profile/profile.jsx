import React, { useEffect, useState } from "react";
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
    roles: [],
    photo: "",
    hasPhoto: false,
  });

  const [profileImage, setProfileImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedData = JSON.parse(sessionStorage.getItem("current-user-ss"));
      if (!storedData) {
        window.location.href = "/logout";
        return;
      }

      setUserData((prev) => ({
        ...prev,
        ...storedData,
      }));

      const image = localStorage.getItem(`profileImage-${storedData.nudoss}`);
      if (image) {
        setProfileImage(image);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const updatedData = { ...userData };
    localStorage.setItem("data", JSON.stringify(updatedData));
    if (profileImage) {
      localStorage.setItem(`profileImage-${userData.nudoss}`, profileImage);
    }
    setEditMode(false);
  };

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
              src={profileImage || "https://i.pravatar.cc/150"}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
            />
          </div>

          <div className="mt-20 text-center">
            <h1 className="text-3xl font-bold mb-4">
              {editMode ? "Modifier Profil" : "Mon Profil"}
            </h1>

            {editMode ? (
              <form onSubmit={handleSave}>
                <div className="flex flex-col items-center mb-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfileImage(reader.result);
                          setUserData((prev) => ({ ...prev, hasPhoto: true }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-white"
                  />
                  {profileImage && (
                    <img
                      src={profileImage}
                      alt="Preview"
                      className="w-28 h-28 rounded-full mt-4 border-2 border-white shadow"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
                  {[
                    { label: "Username", key: "username" },
                    { label: "First Name", key: "firstname" },
                    { label: "Last Name", key: "lastname" },
                    { label: "Phone Number", key: "phonenumber" },
                    { label: "Email", key: "email" },
                    { label: "Matcle", key: "matcle" },
                    { label: "Soccle", key: "soccle" },
                    { label: "Language", key: "language" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block mb-1 text-white/80">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        name={field.key}
                        value={userData[field.key] || ""}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            [field.key]: e.target.value,
                          })
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
                    { label: "Username", key: "username" },
                    { label: "First Name", key: "firstname" },
                    { label: "Last Name", key: "lastname" },
                    { label: "Phone Number", key: "phonenumber" },
                    { label: "Email", key: "email" },
                    { label: "Matcle", key: "matcle" },
                    { label: "Soccle", key: "soccle" },
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

                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-md"
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
