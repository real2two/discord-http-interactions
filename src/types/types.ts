import { Request, Response } from 'hyper-express';

export interface Data { // The only interface you want to modify.
  test: string
}

export interface Command {
  type: number | string,
  name: string,
  custom_id: string | RegExp,
  execute: Function
}

export interface Interaction {
  type: number,
  data: {
    name: string | undefined,
    custom_id: string | RegExp | undefined
  }
}

export interface InteractionData {
  req: Request,
  res: Response,
  data: Data
}

export { Request, Response };