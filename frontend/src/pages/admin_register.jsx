import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api"; 
import btrlogo from '../assets/btrlogo.png';
import btrlegpics from '../assets/btrlegpics.jpg';

export default function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    mobile_number: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setErrors(prev => ({ ...prev, confirm_password: 'Passwords do not match.' }));
      setLoading(false);
      return;
    }

    try {
      await axios.get('/sanctum/csrf-cookie');

      const response = await axios.post('/api/register', {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        mobile_number: formData.mobile_number,
        role: 'admin',
      });

      console.log("Registered user:", response.data.user);
      navigate('/');
    } catch (err) {
      console.error("Registration error:", err.response?.data);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">

      {/* background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${btrlegpics})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* yellow overlay */}
      <div className="absolute inset-0 bg-[#FCFC62] opacity-90"></div>
      
      <form onSubmit={handleRegister}
        className="relative p-6 space-y-4 w-full max-w-sm rounded-lg bg-white"
        style={{ boxShadow: "0 4px 50px rgba(0, 0, 0, 0.3)" }}
      >
        <img src={btrlogo} alt="Logo" className="mx-auto w-24 h-24" />
        <h1 className="text-2xl font-bold text-center text-gray-800">Admin Registration</h1>

        {Object.values(errors).map((err, i) => (
          <p key={i} className="text-red-500 mb-2">{err}</p>
        ))}

        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange}
          className="border p-2 w-full mb-3 rounded text-black" required />

        <input name="username" placeholder="Username" value={formData.username} onChange={handleChange}
          className="border p-2 w-full mb-3 rounded text-black" required />

        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange}
          className="border p-2 w-full mb-3 rounded text-black" required />

        <input name="mobile_number" placeholder="Mobile Number" value={formData.mobile_number} onChange={handleChange}
          className="border p-2 w-full mb-3 rounded text-black" required />

        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange}
          className="border p-2 w-full mb-3 rounded text-black" required />

        <input name="confirm_password" type="password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange}
          className="border p-2 w-full mb-4 rounded text-black" required />

        <button type="submit" disabled={loading}
          className="bg-blue-600 text-white py-2 rounded w-full hover:bg-blue-700">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
