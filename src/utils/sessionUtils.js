// sessionUtils.js
export const setCurrentRole = (role) => {
  sessionStorage.setItem("current-user-ss", JSON.stringify(role));
};

export const getCurrentRole = () => {
  const role = sessionStorage.getItem("current-user-ss");
  return role ? JSON.parse(role) : null;
};

export const callRoleBasedAPI = async (role) => {
  try {
    const response = await fetch("https://your-api.com/your-endpoint", {
      method: "POST", // or GET
      headers: {
        "Content-Type": "application/json",
        // Add token if needed
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
};
