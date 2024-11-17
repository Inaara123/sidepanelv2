//// src/components/settings/FieldMapping.tsx
import React from 'react'
import { Container, Title, SelectButton, XPathText } from './StyledComponents'
import type { XPathData } from './index'

interface FieldMappingProps {
  xpaths: XPathData;
  onElementSelect: (field: string) => void;
}

export const FieldMapping: React.FC<FieldMappingProps> = ({
  xpaths,
  onElementSelect
}) => {
  const fields = [
    { key: 'patientName', label: 'Patient Name' },
    { key: 'address', label: 'Address' },
    { key: 'mobileNumber', label: 'Mobile Number' },
    { key: 'age', label: 'Age' },
    { key: 'doctorName', label: 'Doctor Name' },
    { key: 'doctorDepartment', label: 'Doctor Department' },
    { key: 'bookingType', label: 'Booking Type' },
    { key: 'gender', label: 'Gender' },
    { key: 'referralSource', label: 'Referral Source' }
  ]

  return (
    <Container>
      <Title>Field Mapping</Title>
      {fields.map(({ key, label }) => (
        <SelectButton key={key} onClick={() => onElementSelect(key)}>
          Select {label} {xpaths[key] && <XPathText>{xpaths[key]}</XPathText>}
        </SelectButton>
      ))}
    </Container>
  )
}