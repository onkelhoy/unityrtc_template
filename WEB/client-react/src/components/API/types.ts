export interface IContext {
  Call: (input:RequestInfo, init:RequestInit) => Promise<any>;
}