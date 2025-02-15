export interface IQueue {
  publish( message: object):Promise<void>
  on():Promise<void>
  consume(exchange:string, queue:string, routingKey:string):Promise<void>
}

