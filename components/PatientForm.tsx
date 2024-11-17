// src/components/form/PatientForm.tsx
import React from 'react'
import { Form, Title, Button } from './StyledComponents'
import { PatientFormData } from './index'

interface PatientFormProps {
  formData: PatientFormData;
  setFormData: React.Dispatch<React.SetStateAction<PatientFormData>>;
  onSubmit: (e: React.FormEvent) => void;
}

interface FormFieldProps {
  label: string;
  name: keyof PatientFormData;
  type?: string;
  options?: { value: string; label: string; }[];
}

const FORM_FIELDS: FormFieldProps[] = [
  { label: 'Patient Name', name: 'patientName' },
  { label: 'Address', name: 'address' },
  { label: 'Mobile Number', name: 'mobileNumber', type: 'tel' },
  { label: 'Age', name: 'age', type: 'number' },
  { label: 'Doctor Name', name: 'doctorName' },
  { label: 'Doctor Department', name: 'doctorDepartment' },
  {
    label: 'Booking Type',
    name: 'bookingType',
    type: 'select',
    options: [
      { value: '', label: 'Select Booking Type' },
      { value: 'booking', label: 'Booking' },
      { value: 'appointment', label: 'Appointment' },
      { value: 'emergency', label: 'Emergency' }
    ]
  },
  {
    label: 'Gender',
    name: 'gender',
    type: 'radio',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ]
  },
  {
    label: 'How did you get to know us?',
    name: 'referralSource',
    type: 'select',
    options: [
      { value: '', label: 'Select Source' },
      { value: 'friends', label: 'Friends & Family' },
      { value: 'google', label: 'Google' },
      { value: 'facebook', label: 'Facebook' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'others', label: 'Others' }
    ]
  }
]

export const PatientForm: React.FC<PatientFormProps> = ({
  formData,
  setFormData,
  onSubmit
}) => {
  const handleInputChange = (field: keyof PatientFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderField = (field: FormFieldProps) => {
    const { label, name, type, options } = field

    if (type === 'select' && options) {
      return (
        <div key={name}>
          <label>{label}</label>
          <select
            value={formData[name]}
            onChange={(e) => handleInputChange(name, e.target.value)}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )
    }

    if (type === 'radio' && options) {
      return (
        <div key={name}>
          <label>{label}</label>
          <div>
            {options.map(option => (
              <label key={option.value}>
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={formData[name] === option.value}
                  onChange={(e) => handleInputChange(name, e.target.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div key={name}>
        <label>{label}</label>
        <input
          type={type || 'text'}
          value={formData[name]}
          onChange={(e) => handleInputChange(name, e.target.value)}
        />
      </div>
    )
  }

  return (
    <Form onSubmit={onSubmit}>
      <Title>Patient Details</Title>
      {FORM_FIELDS.map(field => renderField(field))}
      <Button type="submit">Submit</Button>
    </Form>
  )
}