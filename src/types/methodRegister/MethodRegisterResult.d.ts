import { Method } from "../device/Method";
import { RequestStatus } from "../enums/RequestStatus";

export interface MethodRegisterResult {
  name: string
  сorrelationId: string;
  method: Method;
  status: RequestStatus;
  message: string;
  result: string;
  responseReceivedAt: string;
}
