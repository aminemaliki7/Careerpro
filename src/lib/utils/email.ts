const FREE_EMAIL_PROVIDERS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.fr',
  'hotmail.com',
  'hotmail.fr',
  'outlook.com',
  'live.com',
  'icloud.com',
  'me.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'gmx.com',
  'mail.com',
  'yandex.com',
]);

export function isProfessionalEmail(email: string | undefined): boolean {
  const domain = email?.trim().toLowerCase().split('@')[1];
  return Boolean(domain && domain.includes('.') && !FREE_EMAIL_PROVIDERS.has(domain));
}