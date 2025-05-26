import { useEffect, useState } from "react";
import Layout from "../interfaces/frontoffice/layout";

export default function XmlFormList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/forms/getAllXml")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setForms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching forms:", err);
        setForms([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center text-sm text-white/80">Loading ...</div>;
  }

  return (
    <Layout>
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          backgroundImage: "url(/images/bg_login.png)",
          backgroundSize: "cover",
          backgroundPosition: "60% 36%",
        }}
      >
        <div className="relative w-full max-w-4xl px-6 py-20 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 text-white">
          <h2 className="text-center text-2xl font-bold mt-6 mb-2 text-white">
            XML Forms Valables
          </h2>
          <p className="text-center text-sm text-white/80 mb-4">
            choisissez une étape pour consulter XML
          </p>

          {forms.length === 0 ? (
            <div className="text-center text-white/80 py-10">
              Aucune Etape trouvée
            </div>
          ) : (
            <ul className="list px-2 pb-4">
              {forms.map((form) => (
                <li
                  key={form.id}
                  className="flex items-center justify-between px-4 py-2 rounded-md hover:bg-white/10 transition cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-white">{form.label}</div>
                    <div className="text-xs uppercase font-semibold text-white/60">
                      ID: {form.id}
                    </div>
                  </div>

                  <button
                    className="btn btn-square btn-ghost text-white"
                    title="View XML"
                    onClick={() =>
                      document.getElementById(`modal-${form.id}`).showModal()
                    }
                  >
                    <svg
                      className="size-[1.2em]"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M6 3L20 12 6 21 6 3z" />
                      </g>
                    </svg>
                  </button>

                  <dialog id={`modal-${form.id}`} className="modal">
                    <div className="modal-box max-w-2xl bg-white/10 backdrop-blur-md border border-white/30 text-white shadow-xl">
                      <h3 className="font-bold text-lg mb-2">{form.label}</h3>
                      <pre className="bg-white/20 p-4 text-sm max-h-[400px] overflow-auto whitespace-pre-wrap rounded">
                        {form.xmlContent}
                      </pre>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                      <button className="text-white">close</button>
                    </form>
                  </dialog>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}
