import { NextRequest, NextResponse } from 'next/server';
import { fetchCareerjetJobs, CareerjetQueryParams } from '@/lib/careerjet';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get Careerjet API key from environment
    const apiKey = process.env.CAREERJET_API_KEY;
    if (!apiKey) {
      console.error('❌ CAREERJET_API_KEY not found in environment variables');
      return NextResponse.json(
        { type: 'ERROR', message: 'Careerjet API key not configured. Please add CAREERJET_API_KEY to your .env file' },
        { status: 500 }
      );
    }

    console.log('✅ API Key found:', apiKey.substring(0, 8) + '...');

    // Extract user IP and User Agent
    const userIp = 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      '127.0.0.1';
    
    const userAgent = request.headers.get('user-agent') || 'Mozilla/5.0';
    
    // Get referer from request headers (required by Careerjet)
    // Try multiple sources and formats for local development
    const referer = request.headers.get('referer') || 
                    request.headers.get('origin') || 
                    process.env.NEXT_PUBLIC_SITE_URL || 
                    `http://localhost:3000`;

    // Build query parameters
    const params: CareerjetQueryParams = {
      user_ip: userIp,
      user_agent: userAgent,
      locale_code: searchParams.get('locale_code') || 'en_GB',
      keywords: searchParams.get('keywords') || undefined,
      location: searchParams.get('location') || undefined,
      contract_type: (searchParams.get('contract_type') as 'p' | 'c' | 't' | 'i' | 'v') || undefined,
      work_hours: (searchParams.get('work_hours') as 'f' | 'p') || undefined,
      fragment_size: searchParams.get('fragment_size') 
        ? parseInt(searchParams.get('fragment_size')!) 
        : 120,
      sort: (searchParams.get('sort') as 'relevance' | 'date' | 'salary') || 'relevance',
      page: searchParams.get('page') 
        ? parseInt(searchParams.get('page')!) 
        : 1,
      page_size: searchParams.get('page_size') 
        ? parseInt(searchParams.get('page_size')!) 
        : 20,
      radius: searchParams.get('radius') 
        ? parseInt(searchParams.get('radius')!) 
        : 5,
    };

    // Log the request parameters
    console.log('🔍 Careerjet API Request:', {
      keywords: params.keywords,
      location: params.location,
      page: params.page,
      user_ip: params.user_ip,
      referer: referer,
      user_agent: params.user_agent?.substring(0, 50) + '...'
    });

    // Fetch jobs from Careerjet
    const response = await fetchCareerjetJobs(params, apiKey, referer);

    // Log the response type
    console.log('📦 Careerjet API Response:', response.type);

    // Return response with appropriate status
    if (response.type === 'ERROR') {
      console.error('❌ Careerjet API Error:', response.message);
      return NextResponse.json(response, { status: 400 });
    }

    if (response.type === 'LOCATIONS') {
      console.log('📍 Multiple locations found:', response.locations.length);
    }

    if (response.type === 'JOBS') {
      console.log('✅ Jobs found:', response.hits);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('External jobs API error:', error);
    return NextResponse.json(
      { 
        type: 'ERROR', 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}