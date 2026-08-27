import { NextResponse } from 'next/server';
import { getDb } from '@/lib/data';
import { buildCompanyPackage } from '@/lib/company-package';
import { createZipArchive } from '@/lib/zip';

export const dynamic = 'force-dynamic';

// GET → the Paperclip company package (agentcompanies/v1). Bare GET returns
// the file manifest as JSON; `?format=zip` streams a downloadable archive
// ready for `paperclipai company import` or POST /api/companies/import.
export async function GET(request: Request) {
  const db = getDb();
  const pkg = buildCompanyPackage(db);
  const format = new URL(request.url).searchParams.get('format');

  if (format === 'zip') {
    const zip = createZipArchive(pkg.files);
    return new NextResponse(new Uint8Array(zip), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="founder-os-company-package.zip"',
      },
    });
  }

  return NextResponse.json({ schema: 'agentcompanies/v1', slug: 'founder-os', files: pkg.files });
}
