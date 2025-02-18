import { ApplicationException } from "../../application/exceptions/applicationException";

describe('ApplicationException', () => {
  it('Deve ser uma instância de Error', () => {
    const exception = new ApplicationException('Mensagem de erro');
    expect(exception).toBeInstanceOf(Error);
  });

  it('Deve ter o nome "ApplicationException"', () => {
    const exception = new ApplicationException('Mensagem de erro');
    expect(exception.name).toBe('ApplicationException');
  });

  it('Deve ter a mensagem correta se acontecer exceção.', () => {
    const message = 'Mensagem de erro';
    const exception = new ApplicationException(message);
    expect(exception.message).toBe(message);
  });
});
