export interface verifyBvnPayload {
  userId: string;
  bvn: string;
}

export interface identityPayload {
  userId: string,
  idType: string,
  idNumber: string,
  idImageUrl: File | string,
}

export interface profilePayload {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender: string;
  country: string;
}
