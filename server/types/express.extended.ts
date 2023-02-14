import { Request, Response, NextFunction } from 'express'


export interface ExtendedRequest extends Request {
  userId: string
}

export interface ExtendedResponse extends Response {

}

export interface ExtendedNextFunction extends NextFunction {
    
}