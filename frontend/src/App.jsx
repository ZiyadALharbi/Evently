import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import EventPage from "./pages/EventPage.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import OrganizerProfile from "./pages/OrganizerProfile.jsx";
import EditEvent from "./pages/EditEvent.jsx";
import Form from "./pages/Form.jsx";
import Requests from "./pages/Requests.jsx";
import Events from "./pages/Events.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/EventPage/:eventId" element={<EventPage />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/Login" element={<Login />} />
          <Route exact path="/CreateEvent" element={<CreateEvent />} />
          <Route
            exact
            path="/organizer-profile"
            element={<OrganizerProfile />}
          />
          <Route exact path="/student-profile" element={<StudentProfile />} />
          <Route exact path="/EditEvent/:eventId" element={<EditEvent />} />
          <Route path="/form/:eventId" element={<Form />} />
          <Route path="/requests/:eventId" element={<Requests />} />
          <Route exact path="/events" element={<Events />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
