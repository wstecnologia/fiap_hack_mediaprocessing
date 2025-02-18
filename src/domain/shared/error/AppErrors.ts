export class AppErrors {
  errorCode: number
  message: string
  constructor(message: string, errorCode: number = 400) {
    this.errorCode = errorCode
    this.message = message
  }
}
