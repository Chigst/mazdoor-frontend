// src/App.js

import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { auth, db } from "./firebaseConfig";
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
                  <HireRequests />
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole("");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Try again.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <Landing />;
  if (!role) return <RoleSelection user={user} />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className="text-xl md:text-2xl font-bold text-blue-700">
          Welcome {role === "contractor" ? "Contractor" : "Laborer"}
        </h1>

        <div className="mt-2 md:mt-0 flex flex-col md:flex-row items-start md:items-center text-sm text-gray-700 gap-2">
          <Link to="/" className="text-blue-600 hover:underline">
            Dashboard
          </Link>

          {role === "contractor" && (
            <>
              <Link to="/hires" className="text-blue-600 hover:underline">
                Hire Requests
              </Link>
              <Link to="/sent-requests" className="text-blue-600 hover:underline">
                Sent Requests
              </Link>
            </>
          )}

          <Menu as="div" className="relative">
            <Menu.Button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
              Menu ▾
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right bg-white border rounded shadow-lg z-50">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/edit-profile"
                      className={`${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      } block px-4 py-2 text-sm rounded`}
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
                      } block px-4 py-2 text-sm w-full text-left rounded`}
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

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <AnimatedRoutes role={role} user={user} />
      </main>
    </div>
  );
}

export default App;
