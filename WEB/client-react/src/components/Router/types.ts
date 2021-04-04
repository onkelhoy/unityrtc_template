export interface IContext {
  LoadPage: (target:PageTypes) => void;
}


export enum PageTypes {
  Home,
  Lobby,
  Game,
}