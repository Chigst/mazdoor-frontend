// src/ContractorDashboard.js

import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebaseConfig";
import { toast } from "react-toastify";

import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Search, Phone, MessageCircle, Send, Filter } from "lucide-react";

const ContractorDashboard = () => {
  const [laborers, setLaborers] = useState([]);
  const [filteredLaborers, setFilteredLaborers] = useState([]);
  const [contractor, setContractor] = useState(null);
  const [hireRequests, setHireRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const contractorQuery = query(
          collection(db, "contractors"),
          where("uid", "==", user.uid)
        );
        const snapshot = await getDocs(contractorQuery);
        if (!snapshot.empty) {
          const contractorData = {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
          };
          setContractor(contractorData);

          const hireQuery = query(
            collection(db, "hireRequests"),
            where("contractorId", "==", contractorData.id)
          );
          const hireSnap = await getDocs(hireQuery);
          const hireData = hireSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHireRequests(hireData);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLaborers = async () => {
      const q = query(collection(db, "laborers"), where("availability", "==", true));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLaborers(data);
      setFilteredLaborers(data);
    };
    fetchLaborers();
  }, []);

  useEffect(() => {
    const filtered = laborers.filter((l) => {
      const matchesSearch = l.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCity = !selectedCity || l.city === selectedCity;
      const matchesSkill =
        !selectedSkill || (l.skill && l.skill.toLowerCase().includes(selectedSkill.toLowerCase()));
      return matchesSearch && matchesCity && matchesSkill;
    });
    setFilteredLaborers(filtered);
  }, [searchTerm, selectedCity, selectedSkill, laborers]);

  const handleHire = async (laborer) => {
    if (!contractor) {
      toast.error("Contractor not logged in");
      return;
    }

    try {
      await addDoc(collection(db, "hireRequests"), {
        contractorId: contractor.id,
        contractorName: contractor.name,
        laborerId: laborer.id,
        laborerName: laborer.name,
        status: "pending",
        timestamp: serverTimestamp(),
      });
      toast.success("✅ Hire request sent!");

      const hireQuery = query(
        collection(db, "hireRequests"),
        where("contractorId", "==", contractor.id)
      );
      const hireSnap = await getDocs(hireQuery);
      const hireData = hireSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHireRequests(hireData);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to send request.");
    }
  };

  const getRequestStatus = (laborerId) => {
    const match = hireRequests.find((req) => req.laborerId === laborerId);
    return match ? match.status : null;
  };

  const getStatusBadge = (status) => {
    if (!status) return null;
    const variants = {
      pending: "secondary",
      accepted: "success",
      rejected: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const cities = [...new Set(laborers.map((l) => l.city).filter(Boolean))];
  const skills = [...new Set(laborers.map((l) => l.skill).filter(Boolean))];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Mazdoor</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Find Skilled Labor</h2>
          <p className="text-muted-foreground">Hire verified professionals nearby</p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCity ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCity("")}
            >
              <Filter className="h-4 w-4 mr-1" />
              All Cities
            </Button>
            {cities.map((city) => (
              <Button
                key={city}
                variant={selectedCity === city ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSkill ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSkill("")}
            >
              All Skills
            </Button>
            {skills.map((skill) => (
              <Button
                key={skill}
                variant={selectedSkill === skill ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSkill(skill)}
              >
                {skill}
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLaborers.map((laborer) => {
            const status = getRequestStatus(laborer.id);
            return (
              <Card key={laborer.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={laborer.avatar} />
                      <AvatarFallback>
                        {laborer.name?.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{laborer.name}</h3>
                      <p className="text-sm text-muted-foreground">{laborer.city}</p>
                    </div>
                  </div>
                  {getStatusBadge(status)}
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    <strong>Skill:</strong> {laborer.skill}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        laborer.availability ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {laborer.availability ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`tel:${laborer.phone}`)}
                    className="flex-1"
                  >
                    <Phone className="h-4 w-4 mr-1" /> Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://wa.me/${laborer.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hi ${laborer.name}, I found your profile on Mazdoor and would like to discuss a job opportunity.`
                        )}`,
                        "_blank"
                      )
                    }
                    className="flex-1"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleHire(laborer)}
                    disabled={status === "pending" || !laborer.availability}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-1" /> Hire
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredLaborers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No laborers found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ContractorDashboard;
