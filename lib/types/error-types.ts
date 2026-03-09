export interface ApiError {
  success: false;
  status: number;
  message: string;
  raw?: unknown;
}
