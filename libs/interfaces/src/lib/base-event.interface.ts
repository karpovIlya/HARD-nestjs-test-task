import { IBasePayload } from './base-payload.interface'

export interface IBaseEvent<T extends IBasePayload> {
  subject: string
  payload: T
}
