// src/App.js

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Menu } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence, motion } from "framer-motion";

import Landing from "./Landing";
import Login from "./Login";
import RoleSelection from "./RoleSelection";
import ContractorDashboard from "./ContractorDashboard";
import LaborerDashboard from "./LaborerDashboard";
import HireRequests from "./HireRequests";
import SentRequests from "./pages/SentRequests";
import EditProfile from "./pages/EditProfile";

const AnimatedRoutes = ({ role, user }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {role === "contractor" ? (
                <ContractorDashboard user={user} />
              ) : (
                <LaborerDashboard user={user} />
              )}
            </motion.div>
          }
        />
        {role === "contractor" && (
          <>
            <Route
              path="/hires"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <HireRequests user={user} />
                </motion.div>
              }
            />
            <Route
              path="/sent-requests"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SentRequests />
                </motion.div>
              }
            />
          </>
        )}
        <Route
          path="/edit-profile"
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EditProfile />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setRole("");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <Landing />;
  if (!role) return <RoleSelection user={user} />;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <ToastContainer position="top-center" autoClose={3000} />

        {/* Sticky Header */}
        <header className="sticky top-0 z-50 bg-white border-b p-4 shadow-sm flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-blue-700">
            Welcome {role === "contractor" ? "Contractor" : "Laborer"}
          </h1>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-blue-500 underline">Dashboard</Link>

            {role === "contractor" && (
              <>
                <Link to="/hires" className="text-blue-500 underline">Hire Requests</Link>
                <Link to="/sent-requests" className="text-blue-500 underline">Sent Requests</Link>
              </>
            )}

            {/* Dropdown Menu */}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                Menu ▾
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/edit-profile"
                        className={`${
                          active ? "bg-blue-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Edit Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${
                          active ? "bg-red-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </header>

        {/* Animated Routes */}
        <main className="flex-1 overflow-y-auto p-4">
          <AnimatedRoutes role={role} user={user} />
        </main>
      </div>
    </Router>
  );
}

export default App;
