import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from '/Users/ziyadalharbi/EVENT/frontend/src/assets/logo.svg'; 

function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const updateAuthStatus = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user = localStorage.getItem("username");

    if (token && role && user) {
      setIsLoggedIn(true);
      setUserRole(role);
      setUsername(user);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    updateAuthStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/home");
  };

  return (
    <nav className="bg-white shadow-md px-8 flex justify-between items-center">
      <Link className="flex items-center space-x-3" to="/home">
        <img src={Logo} alt="Evently Logo" className="h-16 w-16 rounded-full" />
        <h1 className="text-3xl font-bold text-teal-600">EVENTLY</h1>
      </Link>
      <div className="flex items-center space-x-6">
        <Link className="text-gray-700 hover:text-teal-500 transition-colors duration-300" to="/home">
          Home
        </Link>
        <Link className="text-gray-700 hover:text-teal-500 transition-colors duration-300" to="/events">
          Events
        </Link>
        {isLoggedIn && userRole === "organizer" && (
          <Link className="text-gray-700 hover:text-teal-500 transition-colors duration-300" to="/CreateEvent">
            Create Event
          </Link>
        )}
        {isLoggedIn ? (
          <>
            {userRole === "admin" ? (
              <Link
                className="text-gray-700 hover:text-teal-500 transition-colors duration-300"
                to="/admin-dashboard"
              >
                <span className="px-4 py-2 bg-teal-500 text-white rounded-md shadow hover:bg-teal-600 transition-transform duration-300 transform hover:scale-105">
                  Dashboard
                </span>
              </Link>
            ) : (
              <Link
                className="text-gray-700 hover:text-teal-500 transition-colors duration-300"
                to={userRole === "organizer" ? "/organizer-profile" : "/student-profile"}
              >
                <span className="px-4 py-2 bg-teal-500 text-white rounded-md shadow hover:bg-teal-600 transition-transform duration-300 transform hover:scale-105">
                  Profile
                </span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-500 transition-colors duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="text-gray-700 hover:text-teal-500 transition-colors duration-300" to="/Login">
              Login
            </Link>
            <Link to="/signup">
              <button className="bg-teal-500 text-white px-4 py-2 rounded-md shadow hover:bg-teal-600 transition-transform duration-300 transform hover:scale-105">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;





// import { Link, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Logo from '/Users/ziyadalharbi/EVENT/frontend/src/assets/profile.png'; 

// function NavBar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState("");
//   const [username, setUsername] = useState("");
//   const navigate = useNavigate();

//   const updateAuthStatus = () => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role"); 
//     const user = localStorage.getItem("username"); 

//     if (token && role && user) {
//       setIsLoggedIn(true);
//       setUserRole(role);
//       setUsername(user);
//     } else {
//       setIsLoggedIn(false);
//     }
//   };

//   useEffect(() => {
//     updateAuthStatus();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("username");
//     setIsLoggedIn(false);
//     navigate("/home");
//   };

//   return (
//     <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
//       <div className="flex items-center space-x-3">
//         <img src={Logo} alt="Evently Logo" className="h-10 w-10 rounded-full" />
//         <h1 className="text-3xl font-bold text-teal-600">EVENTLY</h1>
//       </div>
//       <div className="flex items-center space-x-6">
//         <Link className="text-gray-700 hover:text-teal-500 transition-colors duration-300" to="/home">
//           Home
//         </Link>
//         <Link className="text-gray-700 hover:text-teal-500 transition-colors duration-300" to="/events">
//           Events
//         </Link>
//         {isLoggedIn && userRole === "organizer" && (
//           <Link className="text-gray-700 hover:text-teal-500 transition-colors duration-300" to="/CreateEvent">
//             Create Event
//           </Link>
//         )}
//         {isLoggedIn ? (
//           <>
//             <Link
//               className="text-gray-700 hover:text-teal-500 transition-colors duration-300"
//               to={userRole === "organizer" ? "/organizer-profile" : "/student-profile"}
//             >
//               <span className="px-4 py-2 bg-teal-500 text-white rounded-md shadow hover:bg-teal-600 transition-transform duration-300 transform hover:scale-105">
//                Profile
//               </span>
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="text-gray-700 hover:text-red-500 transition-colors duration-300"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <>
//             <Link className="text-gray-700 hover:text-teal-500 transition-colors duration-300" to="/Login">
//               Login
//             </Link>
//             <Link to="/signup">
//               <button className="bg-teal-500 text-white px-4 py-2 rounded-md shadow hover:bg-teal-600 transition-transform duration-300 transform hover:scale-105">
//                 Sign Up
//               </button>
//             </Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default NavBar;