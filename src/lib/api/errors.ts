// src/lib/api/errors.ts
// Consistent server-side error/response helpers.
// 5xx responses never leak internal database details. 4xx responses carry a
// safe, actionable message. Successful responses keep the existing shape that
// frontend consumers already depend on.
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export type ApiError = {
  error: string;
  detail?: string;
};

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function badRequest(message = 'Invalid request'): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function unauthorized(message = 'Unauthorized'): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden(message = 'Forbidden'): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function notFound(message = 'Not found'): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 });
}

/**
 * Convert a Zod validation failure into a safe 400 response.
 */
export function validationError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    const first = error.errors[0];
    return NextResponse.json(
      {
        error: first
          ? `${first.path.join('.') || 'request'}: ${first.message}`
          : 'Invalid request',
      },
      { status: 400 }
    );
  }
  return badRequest();
}

/**
 * Wrap an unknown error into a consistent 500 response that never leaks
 * internal details to the client. The real error is logged server-side.
 */
export function serverError(error: unknown, context?: string): NextResponse {
  console.error(context ? `[${context}]` : '[api]', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
