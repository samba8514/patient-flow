
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterControlsProps {
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ statusFilter, setStatusFilter }) => {
  return (
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Patients</SelectItem>
        <SelectItem value="urgent">Urgent (≤2 days)</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FilterControls;
