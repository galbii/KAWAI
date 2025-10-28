/**
 * Music School Contact Export API
 *
 * One-off endpoint to fetch all KPM DALLAS contacts and export them
 * Supports both JSON and CSV formats
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { createConstantContactClient } from '@/lib/constantcontact/client';
import {
  createMusicSchoolExporter,
  MusicSchoolContactExporter
} from '@/lib/constantcontact/music-school-export';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json'; // 'json' or 'csv'

    console.log('📊 Music School Export: Starting contact export...');
    console.log(`📊 Export format: ${format}`);

    // Initialize services
    const payload = await getPayload({ config });
    const client = createConstantContactClient(payload);
    const exporter = createMusicSchoolExporter(client, payload);

    // Fetch and transform all contacts
    const result = await exporter.exportKPMDallasContacts();

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to export contacts'
        },
        { status: 500 }
      );
    }

    console.log(`✅ Export successful: ${result.totalContacts} contacts exported`);

    // Return in requested format
    if (format === 'csv') {
      const csv = MusicSchoolContactExporter.exportToCSV(result.contacts);
      const filename = `kpm-dallas-contacts-${new Date().toISOString().split('T')[0]}.csv`;

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    }

    // Default: JSON format
    return NextResponse.json({
      success: true,
      data: result,
      summary: {
        totalContacts: result.totalContacts,
        exportedAt: result.exportedAt,
        listName: result.listName,
        listId: result.listId
      }
    });

  } catch (error) {
    console.error('❌ Music School Export error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Info endpoint
 */
export async function POST() {
  return NextResponse.json({
    error: 'Method not allowed. Use GET to export contacts.',
    usage: {
      json: 'GET /api/music-school/export-contacts',
      csv: 'GET /api/music-school/export-contacts?format=csv'
    }
  }, { status: 405 });
}
