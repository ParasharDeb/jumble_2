export interface AuthenticatedRequest extends Request {
  userId?: string;  
}
export interface Jobrequest extends Request {
  jobId: number;  
}

