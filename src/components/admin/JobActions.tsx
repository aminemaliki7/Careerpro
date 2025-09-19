"use client";

import Link from 'next/link';

interface JobActionsProps {
  slug: string;
}

export default function JobActions({ slug }: JobActionsProps) {
  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce job?')) {
      // TODO: Implémenter la suppression
      alert('Suppression à implémenter');
    }
  };

  return (
    <div className="flex items-center space-x-3 ml-4">
      <Link
        href={`/admin/jobs/${slug}/edit`}
        className="text-blue-600 hover:text-blue-500 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
      >
        Modifier
      </Link>
      <Link
        href={`/jobs/${slug}`}
        target="_blank"
        className="text-gray-600 hover:text-gray-500 text-sm font-medium bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded transition-colors"
      >
        Voir
      </Link>
      <button
        onClick={handleDelete}
        className="text-red-600 hover:text-red-500 text-sm font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
      >
        Supprimer
      </button>
    </div>
  );
}