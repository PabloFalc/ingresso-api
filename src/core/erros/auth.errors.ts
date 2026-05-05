import { ConflictError, NotFoundError, UnauthorizedError } from './http.errors';

type ErrorParams = {
  message?: string;
  details?: unknown;
};

export class UserNotFoundError extends NotFoundError {
  constructor(params?: ErrorParams) {
    super({
      message: params?.message ?? 'Usuário não encontrado',
      details: params?.details,
    });
  }
}

export class OrganizationNotFoundError extends NotFoundError {
  constructor(params?: ErrorParams) {
    super({
      message: params?.message ?? 'Organização não encontrada',
      details: params?.details,
    });
  }
}

export class RefreshTokenInvalidError extends UnauthorizedError {
  constructor(params?: ErrorParams) {
    super({
      message: params?.message ?? 'Refresh token inválido ou expirado',
      details: params?.details,
    });
  }
}

export class EmailAlreadyInUseError extends ConflictError {
  constructor(params?: ErrorParams) {
    super({
      message: params?.message ?? 'Email já cadastrado',
      details: params?.details,
    });
  }
}

export class InvalidCredentialsError extends UnauthorizedError {
  constructor(params?: ErrorParams) {
    super({
      message: params?.message ?? 'Email ou senha inválidos',
      details: params?.details,
    });
  }
}

export class RefreshTokenRevokedError extends UnauthorizedError {
  constructor(params?: ErrorParams) {
    super({
      message: params?.message ?? 'Refresh token revogado',
      details: params?.details,
    });
  }
}
