import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ChangePassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState("fr");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError(
        "Le nouveau mot de passe et la confirmation ne correspondent pas."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8181/https://tnhldapp0144.interpresales.mysoprahronline.com/hr-business-services-rest/business-services/login",
        {
          username,
          password,
          newPassword,
          newPassword2: confirmPassword,
          language,
          hint: "standardLoginModule",
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.status === "OK") {
        setSuccess("Mot de passe modifié avec succès.");
      } else {
        setError(
          response.data.message || "Erreur de modification du mot de passe."
        );
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError(
        "Échec de la demande. Veuillez vérifier votre connexion ou les informations saisies."
      );
    }
  };

  return (
    <section className="min-h-screen flex items-stretch text-white relative">
      {/* Left side with background video */}
      <div className="lg:flex w-1/2 hidden relative items-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/images/logo_video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Right side with form */}
      <div
        className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0"
        style={{
          background:
            "linear-gradient(to left, rgba(8, 12, 20, 0.9) 0%, rgba(2, 5, 12, 1) 100%)",
          backdropFilter: "blur(3px)",
        }}
      >
        <div className="absolute lg:hidden z-10 inset-0 overflow-hidden">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/images/logo_video.mp4" type="video/mp4" />
          </video>
          <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
        </div>

        {/* Content */}
        <div className="w-full py-6 z-20">
          <div className="w-full z-10 flex justify-center ">
            <img src="/images/logosopra.png" alt="Logo" className="h-16" />
          </div>
          <div className="py-6 space-x-2"></div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Changer le mot de passe
          </h2>
          {error && (
            <div className="text-sm text-red-500 mb-3 text-center">{error}</div>
          )}
          {success && (
            <div className="text-sm text-green-500 mb-3 text-center">
              {success}
            </div>
          )}

          <div className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="pb-2 pt-4">
                <input
                  name="username"
                  placeholder="Login"
                  className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="pb-2 pt-4">
                <input
                  type="password"
                  placeholder="Mot de passe actuel"
                  className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pb-2 pt-4">
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pb-2 pt-4">
                <input
                  type="password"
                  placeholder="Confirmer le nouveau mot de passe"
                  className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pb-2 pt-4">
                <select
                  name="language"
                  className="block w-full bg-black text-white select select-md"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="es">Espagnol</option>
                  <option value="de">Allemand</option>
                </select>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="btn btn-outline text-white border-white hover:bg-white hover:text-black"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="btn btn-neutral text-white btn-outline bg-black hover:bg-white hover:text-black"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
