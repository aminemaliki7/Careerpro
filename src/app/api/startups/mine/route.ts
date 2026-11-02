import { NextResponse } from 'next/server';
import { requireCompanyUser } from '@/lib/auth/authorization';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET() {
  const authResult = await requireCompanyUser();
  if (authResult.response) return authResult.response;

  const { data, error } = await supabaseAdmin
    .from('startups')
    .select('id,slug,name,description,full_description,industry,size,funding_stage,founded_date,location,website_url,logo_url,contact_name,contact_email,status')
    .eq('owner_id', authResult.userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading owned startup profiles:', error);
    return NextResponse.json({ error: 'Failed to load startup profiles' }, { status: 500 });
  }

  const startupsWithOpportunities = await Promise.all(
    (data ?? []).map(async (startup) => {
      const { data: opportunities, error: opportunitiesError } = await supabaseAdmin
        .from('jobs')
        .select('id,title,location,type,slug,posted_date,description,requirements,skills,remote,salary_range,compensation_type,status')
        .eq('startup_id', startup.id)
        .eq('owner_id', authResult.userId)
        .order('posted_date', { ascending: false });

      return {
        startup,
        opportunities,
        error: opportunitiesError,
      };
    })
  );

  const failedOpportunityLookup = startupsWithOpportunities.find((result) => result.error);
  if (failedOpportunityLookup?.error) {
    console.error('Error loading published startup opportunities:', failedOpportunityLookup.error);
    return NextResponse.json({ error: 'Failed to load startup opportunities' }, { status: 500 });
  }

  const startups = startupsWithOpportunities.map(({ startup, opportunities }) => ({
    id: startup.id,
    slug: startup.slug,
    name: startup.name,
    description: startup.description,
    fullDescription: startup.full_description ?? '',
    industry: startup.industry,
    size: startup.size,
    fundingStage: startup.funding_stage,
    foundedDate: startup.founded_date,
    location: startup.location,
    websiteUrl: startup.website_url,
    logoUrl: startup.logo_url ?? '',
    contactName: startup.contact_name ?? '',
    contactEmail: startup.contact_email ?? '',
    status: startup.status,
    publishedOpportunityCount: opportunities?.filter((opportunity) => opportunity.status === 'approved').length ?? 0,
    opportunities: opportunities ?? [],
  }));

  return NextResponse.json({ startups });
}
