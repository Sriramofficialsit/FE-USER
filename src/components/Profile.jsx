import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, logout, deleteAccount } from "./api";

function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dob: "",
    contact: "",
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then((data) => {
        setFormData({
          name: data.name || "",
          age: data.age || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          contact: data.contact || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await updateProfile(formData);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you ABSOLUTELY sure you want to delete your account? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteAccount();
      localStorage.removeItem("token");
      alert("Account deleted successfully.");
      navigate("/login");
    } catch (err) {
      alert(
        "Failed to delete account: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Profile</h2>

        {["name", "age", "dob", "contact"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-gray-700 capitalize mb-1">
              {field}
            </label>
            <input
              name={field}
              type={field === "dob" ? "date" : "text"}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <button
          onClick={handleUpdate}
          disabled={updating}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 mb-3 flex items-center justify-center"
        >
          {updating ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-gray-600 text-white p-3 rounded-lg font-medium hover:bg-gray-700 mb-3"
        >
          Logout
        </button>

        <div className="border-t pt-4">
          {showDeleteConfirm ? (
            <div className="text-center">
              <p className="text-red-600 font-bold mb-3">
                Confirm account deletion?
              </p>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded mr-3 hover:bg-red-700"
              >
                Yes, Delete Forever
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-red-600 text-white p-3 rounded-lg font-medium hover:bg-red-700"
            >
              Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
