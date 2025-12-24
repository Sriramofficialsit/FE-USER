import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "./api";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    dob: "",
    contact: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      alert("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
    { name: "age", label: "Age", type: "number" },
    { name: "dob", label: "Date of Birth", type: "date" },
    { name: "contact", label: "Contact Number", type: "text" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        {error && (
          <p className="text-red-500 text-center mb-4 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-gray-700 capitalize mb-1">
                {field.label}{" "}
                {field.name !== "age" && field.name !== "contact" && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.label}
                value={formData[field.name]}
                onChange={handleChange}
                required={
                  field.name === "name" ||
                  field.name === "email" ||
                  field.name === "password" ||
                  field.name === "dob"
                }
                min={field.name === "age" ? "1" : undefined}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transition mt-4"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
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
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
