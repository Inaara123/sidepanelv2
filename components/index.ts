// src/components/types/index.ts

export interface PatientFormData {
    patientName: string;
    address: string;
    mobileNumber: string;
    age: string;
    doctorName: string;
    doctorDepartment: string;
    bookingType: string;
    gender: string;
    referralSource: string;
  }
  
  export interface XPathData {
    [key: string]: string;
  }
  
  export interface MessageTypes {
    DATA_UPDATED: {
      type: "DATA_UPDATED";
      field: keyof PatientFormData;
      data: string;
    };
    DATA_SOURCE_SELECTED: {
      type: "DATA_SOURCE_SELECTED";
      field: keyof PatientFormData;
      xpath: string;
    };
  }