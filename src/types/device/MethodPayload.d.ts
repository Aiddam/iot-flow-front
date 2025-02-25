import { ParameterPayload } from './ParameterPayload';
export interface MethodPayload {
  methodName: string;
  parameters: ParameterPayload[];
}
