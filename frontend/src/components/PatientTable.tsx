
import React from 'react';
import { Check, X } from 'lucide-react';
import { Patient } from './PatientTaskTracker';

interface PatientTableProps {
  patients: Patient[];
  updatePatientStatus: (patientId: string, field: keyof Patient, value: boolean) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, updatePatientStatus }) => {
  const StatusIcon = ({ 
    isCompleted, 
    patientId, 
    field, 
    updateStatus 
  }: { 
    isCompleted: boolean; 
    patientId: string; 
    field: keyof Patient; 
    updateStatus: (id: string, field: keyof Patient, value: boolean) => void; 
  }) => (
    <button
      onClick={() => updateStatus(patientId, field, !isCompleted)}
      className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
        isCompleted
          ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
          : 'bg-white border-gray-300 text-red-500 hover:border-red-300 hover:bg-red-50'
      }`}
    >
      {isCompleted ? <Check size={20} /> : <X size={20} />}
    </button>
  );

  const getDeadlineStyle = (days: number) => {
    if (days <= 1) return 'bg-red-500 text-white';
    if (days <= 2) return 'bg-yellow-500 text-white';
    return 'bg-green-500 text-white';
  };

  const getDeadlineText = (days: number) => {
    return days === 1 ? '1 day' : `${days} days`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-4 px-6 font-semibold text-gray-700 w-1/6">
              Patient Name
            </th>
            <th className="text-center py-4 px-4 font-semibold text-gray-700 w-1/8">
              Started Work
            </th>
            <th className="text-center py-4 px-4 font-semibold text-gray-700 w-1/8">
              Image Sent
            </th>
            <th className="text-center py-4 px-4 font-semibold text-gray-700 w-1/8">
              Material Received
            </th>
            <th className="text-center py-4 px-4 font-semibold text-gray-700 w-1/8">
              Report Completed
            </th>
            <th className="text-center py-4 px-4 font-semibold text-gray-700 w-1/8">
              Review Pending
            </th>
            <th className="text-center py-4 px-6 font-semibold text-gray-700 w-1/6">
              Deadline
            </th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr 
              key={patient.id} 
              className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
              }`}
            >
              <td className="py-4 px-6 font-medium text-gray-800">
                {patient.name}
              </td>
              <td className="py-4 px-4 text-center">
                <StatusIcon
                  isCompleted={patient.started_work}
                  patientId={patient.id}
                  field="started_work"
                  updateStatus={updatePatientStatus}
                />
              </td>
              <td className="py-4 px-4 text-center">
                <StatusIcon
                  isCompleted={patient.image_sent}
                  patientId={patient.id}
                  field="image_sent"
                  updateStatus={updatePatientStatus}
                />
              </td>
              <td className="py-4 px-4 text-center">
                <StatusIcon
                  isCompleted={patient.material_received}
                  patientId={patient.id}
                  field="material_received"
                  updateStatus={updatePatientStatus}
                />
              </td>
              <td className="py-4 px-4 text-center">
                <StatusIcon
                  isCompleted={patient.report_completed}
                  patientId={patient.id}
                  field="report_completed"
                  updateStatus={updatePatientStatus}
                />
              </td>
              <td className="py-4 px-4 text-center">
                <StatusIcon
                  isCompleted={patient.review_pending}
                  patientId={patient.id}
                  field="review_pending"
                  updateStatus={updatePatientStatus}
                />
              </td>
              <td className="py-4 px-6 text-center">
                <span 
                  className={`px-3 py-2 rounded-lg font-semibold text-sm ${getDeadlineStyle(patient.deadline)}`}
                >
                  {getDeadlineText(patient.deadline)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
