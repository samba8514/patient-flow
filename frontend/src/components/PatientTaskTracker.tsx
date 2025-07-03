import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PatientTable from './PatientTable';
import AddPatientDialog from './AddPatientDialog';
import FilterControls from './FilterControls';
import { io } from "socket.io-client";

export interface Patient {
  id: string;
  name: string;
  started_work: boolean;
  image_sent: boolean;
  material_received: boolean;
  report_completed: boolean;
  review_pending: boolean;
  deadline: number;
}

// 👇 Setup socket.io connection
const socket = io(import.meta.env.VITE_API_URL);

const PatientTaskTracker = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch patients once on load
  useEffect(() => {
    const fetchPatients = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/patients`);
      const data = await res.json();
      setPatients(data);
    };
    fetchPatients();
  }, []);

  // 👇 Real-time update via socket
  useEffect(() => {
    socket.on('patient_added', (newPatient: Patient) => {
      setPatients((prev) => [...prev, newPatient]);
    });

    return () => {
      socket.off('patient_added');
    };
  }, []);

const updatePatientStatus = async (patientId: string, field: keyof Patient, value: boolean) => {
  const updatedField = {
    [field]: value
  };

  try {
    await fetch(`${import.meta.env.VITE_API_URL}/api/patients/${patientId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedField)
    });

    setPatients(prev =>
      prev.map(patient =>
        patient.id === patientId ? { ...patient, [field]: value } : patient
      )
    );
  } catch (error) {
    console.error('Failed to update patient:', error);
  }
};

  const addPatient = async (name: string, deadline: number) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, deadline })
    });
    // No need to manually update state — the `socket.on` will handle it
  };

  const filteredPatients = patients.filter(patient => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'urgent') return patient.deadline <= 2;
    if (statusFilter === 'completed') return patient.report_completed && patient.review_pending;
    if (statusFilter === 'pending') return !patient.report_completed || !patient.review_pending;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-white border-b border-gray-200 rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl font-bold text-gray-800">
              Patient Task Tracker
            </CardTitle>
            <div className="flex gap-3">
              <FilterControls 
                statusFilter={statusFilter} 
                setStatusFilter={setStatusFilter}
              />
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Add Patient
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <PatientTable 
            patients={filteredPatients} 
            updatePatientStatus={updatePatientStatus}
          />
        </CardContent>
      </Card>

      <AddPatientDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={addPatient}
      />
    </div>
  );
};

export default PatientTaskTracker;
