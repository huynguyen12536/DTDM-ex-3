/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../redux/features/auth/authApi";

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    e.preventDefault();
    const data = {
      username,
      email,
      password,
    };

    console.log(data);
    try {
      await registerUser(data).unwrap();
      alert("Đăng ký thành công");
      navigate('/login');
    } catch (err) {
      alert("Đăng ký thất bại");
    }
  };

  return (
    <section className='h-screen flex items-center justify-center'>
      <div className="max-w-sm mx-auto bg-white border shadow p-8">
        <h2 className="text-2xl font-semibold pt-5">Vui lòng đăng ký</h2>
        <form
          onSubmit={handleRegister}
          className="space-y-5 max-w-sm mx-auto pt-8"
        >
          <input
            type="text"
            value={username}
            className="w-full bg-gray-100 focus:outline-none px-5 py-3"
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Tên người dùng"
            required
          />

          <input
            type="text"
            value={email}
            className="w-full bg-gray-100 focus:outline-none px-5 py-3"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <input
            type="password"
            value={password}
            className="w-full bg-gray-100 focus:outline-none px-5 py-3"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mật khẩu"
            required
          />
          {
            message && <p className="text-red-500">{message}</p>
          }
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md"
          >
            Đăng ký
          </button>
        </form>

        <p className="my-5 italic text-sm text-center">
          Đã có tài khoản? Vui lòng 
          <Link to="/login" className="text-red-700  px-1 underline">
            Đăng nhập
          </Link>

        </p>
      </div>
    </section>

  );
};

export default Register;