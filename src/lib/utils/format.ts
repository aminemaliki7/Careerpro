export function formatSalary(
  min?: number | null, 
  max?: number | null, 
  currency: string = 'USD', 
  period?: string
): string {
  if (min == null && max == null) return '';

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const periodSuffix = period ? ` / ${period}` : '';

  if (min != null && max != null) {
    if (min === max) {
      return `${formatter.format(min)}${periodSuffix}`;
    }
    return `${formatter.format(min)} - ${formatter.format(max)}${periodSuffix}`;
  }

  const value = min ?? max ?? 0;
  return `${formatter.format(value)}${periodSuffix}`;
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ''; // Safeguard against invalid date strings

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export function createJobSlug(title?: string | null): string {
  if (!title || typeof title !== 'string') return 'job';

  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '');    // Remove leading/trailing hyphens

  // If slug is empty after regex filtering (e.g., non-Latin chars), fall back to 'job'
  return slug || 'job';
}