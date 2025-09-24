import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/api";
import BTRheader from "../components/modals/btrHeader";
import BTRNavbar from "../components/modals/btrNavbar.jsx";

export default function ServiceRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    mobile_number: '',
    address: '',
    service_type: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleBack = () => navigate("/admin/dashboard");

  const serviceTypes = [
    { value: 'Vehicle', label: 'Vehicle' },
    { value: 'Appliances', label: 'Appliances' },
    { value: 'ICT Equipment', label: 'ICT Equipment' },
  ];

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
        address: formData.address,
        service_type: formData.service_type,
        role:'service_user',
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
  <>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative">
      <div className="absolute top-0 left-0 w-full">
        <BTRheader />
        <BTRNavbar />
      </div>

      <form onSubmit={handleRegister} className="bg-[#FCFC62] p-6 rounded shadow-md w-full max-w-4xl mx-auto mt-24">

      <h1 className="text-2xl font-bold mb-6 text-[#2F549A] text-center">Service User Registration</h1>

      {Object.values(errors).map((err, i) => (
      <p key={i} className="text-red-500 mb-2">{err}</p>
  ))}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <input name="name" placeholder="Name" value={formData.name} onChange={handleChange}
       className="border p-2 w-full rounded text-black" required />

       <input name="username" placeholder="Username" value={formData.username} onChange={handleChange}
       className="border p-2 w-full rounded text-black" required />

       <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange}
       className="border p-2 w-full rounded text-black" required />

       <input name="mobile_number" placeholder="Mobile Number" value={formData.mobile_number} onChange={handleChange}
       className="border p-2 w-full rounded text-black" required />

      <input name="address" placeholder="Address" value={formData.address} onChange={handleChange}
       className="border p-2 w-full rounded text-black" required />

       <select name="service_type" value={formData.service_type} onChange={handleChange}
        className="border p-2 w-full rounded text-black" required>
        <option value="">Select Service Type</option>
        {serviceTypes.map(type => (
        <option key={type.value} value={type.value}>{type.label}</option>
      ))}
     </select>

         <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange}
         className="border p-2 w-full rounded text-black" required />

        <input name="confirm_password" type="password" placeholder="Confirm Password" value={formData.confirm_password} onChange={handleChange}
        className="border p-2 w-full rounded text-black" required />
  </div>

        <button type="submit" disabled={loading}
        className="bg-blue-600 text-white py-2 rounded w-full mt-6 hover:bg-blue-700">
        {loading ? "Registering..." : "Register"}
  </button>
</form>

    </div>
  </>
);
}
