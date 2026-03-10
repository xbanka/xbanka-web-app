export interface verifyBvnPayload {
  userId: string;
  bvn: string;
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
