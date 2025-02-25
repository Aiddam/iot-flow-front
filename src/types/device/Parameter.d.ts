import { ParameterType } from "../enums/ParameterType";

export interface Parameter {
  parameterName: ParameterType;
  description: string;
  parameterType: int;
  value: string;
}
