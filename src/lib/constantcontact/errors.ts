/**
 * Custom Error Classes for Constant Contact Integration
 *
 * Provides structured error handling for authentication and API operations
 */

/**
 * Thrown when re-authorization is required (refresh token expired or invalid)
 * This error signals that user interaction is needed to complete OAuth flow
 */
export class ReauthRequiredError extends Error {
  public readonly authUrl: string;
  public readonly expiresAt?: string;
  public readonly status: 'expired' | 'refresh_failed';

  constructor(
    message: string,
    authUrl: string,
    status: 'expired' | 'refresh_failed' = 'expired',
    expiresAt?: string
  ) {
    super(message);
    this.name = 'ReauthRequiredError';
    this.authUrl = authUrl;
    this.status = status;
    if (expiresAt !== undefined) {
      this.expiresAt = expiresAt;
    }

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ReauthRequiredError);
    }
  }

  /**
   * Check if an error is a ReauthRequiredError
   */
  static isReauthRequired(error: unknown): error is ReauthRequiredError {
    return error instanceof ReauthRequiredError;
  }

  /**
   * Convert to structured error response for API routes
   */
  toJSON() {
    return {
      error: this.message,
      reauth_required: true,
      auth_url: this.authUrl,
      status: this.status,
      expires_at: this.expiresAt,
    };
  }
}

/**
 * Thrown when Constant Contact API returns an error
 */
export class ConstantContactAPIError extends Error {
  public readonly statusCode: number;
  public readonly errorKey?: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, errorKey?: string, details?: unknown) {
    super(message);
    this.name = 'ConstantContactAPIError';
    this.statusCode = statusCode;
    if (errorKey !== undefined) {
      this.errorKey = errorKey;
    }
    if (details !== undefined) {
      this.details = details;
    }

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConstantContactAPIError);
    }
  }

  /**
   * Convert to structured error response for API routes
   */
  toJSON() {
    return {
      error: this.message,
      status_code: this.statusCode,
      error_key: this.errorKey,
      details: this.details,
    };
  }
}

/**
 * Thrown when authentication credentials are not configured
 */
export class CredentialsNotFoundError extends Error {
  constructor(message: string = 'Constant Contact credentials not found in database or environment variables') {
    super(message);
    this.name = 'CredentialsNotFoundError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CredentialsNotFoundError);
    }
  }
}
