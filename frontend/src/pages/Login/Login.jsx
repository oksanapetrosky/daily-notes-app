// import React, { useState } from "react";
// import Navbar from "../../components/Navbar/Navbar";
// import { Link } from "react-router-dom";
// import PasswordInput from "../../components/Input/PasswordInput";
// import { validateEmail } from "../../utils/helper.js";

// const Login = () => {
// const [email, setEmail] = useState("");
// const [password, setPassword] = useState("");
// const [error, setError] = useState(null);

// const handleLogin = async (e) => {
//   e.preventDefault();
//   if (!validateEmail(email)){
//     setError("Please enter a valid email address.");
//     return;
//   }
//   if(!password){
//     setError("Please enter your password");
//     return;
//   }

//   setError("")

//   //Login API call
// }

// return (
//     <>
//       <Navbar />
//       <div className="flex items-center justify-center mt-28">
//         <div className="w-96 border rounded bg-white px-7 py-10">
//           <form onSubmit={handleLogin}>
//             <h4 className="text-2xl mb-7">Login</h4>

//             <input type="text" placeholder="Email" className="input-box" 
//             value={email}
//             onChange={(e)=> setEmail(e.target.value)}/>

//             <PasswordInput value={password}
//             onChange={(e)=> setPassword(e.target.value)}/>

//            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

//             <button type="submit" className="btn-primary">
//               Login
//             </button>
//             <p className="text-sm text-cente mt-4">
//               Not registered yet?{" "}
//               <Link to="/signup" className="font-medium text-blue-700 underline">
//                 Create an Account
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;
import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError(null);

    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        setError(data.message);
      } else {
        console.log("Login successful:", data);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link to="/signup" className="font-medium text-blue-700 underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
