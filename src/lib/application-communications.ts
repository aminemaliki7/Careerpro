type DatabaseError = {
  code?: string;
} | null | undefined;

export function isMissingCommunicationsTable(error: DatabaseError): boolean {
  return error?.code === 'PGRST205' || error?.code === '42P01';
}