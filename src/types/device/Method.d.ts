export interface Method {
  methodName: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  parameters: Parameter[];

}
