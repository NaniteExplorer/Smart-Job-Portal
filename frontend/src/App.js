import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "./store/authSlice";

import Header from "./Components/layout/Header";
import Footer from "./Components/layout/Footer";
import ScrollToTop from "./Components/layout/ScrollToTop";
import ProtectedRoute from "./Components/Route/ProtectedRoute";

import Home from "./Components/Home/Home";
import Jobs from "./Components/Jobs/Jobs";
import JobDetails from "./Components/Jobs/JobDetails";
import Events from "./Components/Events/Events";
import EventDetails from "./Components/Events/EventDetails";
import Login from "./Components/Auth/Login";
import Signup from "./Components/Auth/Signup";
import Dashboard from "./Components/Dashboard/Dashboard";
import Profile from "./Components/Profile/Profile";
import EditProfile from "./Components/Profile/EditProfile";
import MyApplications from "./Components/Student/MyApplications";
import SavedJobs from "./Components/Student/SavedJobs";
import ManageJobs from "./Components/Recruiter/ManageJobs";
import JobApplicants from "./Components/Recruiter/JobApplicants";
import JobForm from "./Components/Recruiter/JobForm";
import ManageEvents from "./Components/Host/ManageEvents";
import EventForm from "./Components/Host/EventForm";
import About from "./Components/Pages/About";
import Contact from "./Components/Pages/Contact";
import NotFound from "./Components/layout/NotFound";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Authenticated — any role */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
            </Route>

            {/* Student only */}
            <Route element={<ProtectedRoute roles={["student"]} />}>
              <Route path="/applications" element={<MyApplications />} />
              <Route path="/saved" element={<SavedJobs />} />
            </Route>

            {/* Recruiter only */}
            <Route element={<ProtectedRoute roles={["recruiter"]} />}>
              <Route path="/recruiter/jobs" element={<ManageJobs />} />
              <Route path="/recruiter/jobs/new" element={<JobForm />} />
              <Route path="/recruiter/jobs/:id/edit" element={<JobForm />} />
              <Route path="/recruiter/jobs/:id/applicants" element={<JobApplicants />} />
            </Route>

            {/* Host — recruiter or university */}
            <Route element={<ProtectedRoute roles={["recruiter", "university"]} />}>
              <Route path="/host/events" element={<ManageEvents />} />
              <Route path="/host/events/new" element={<EventForm />} />
            </Route>

            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
