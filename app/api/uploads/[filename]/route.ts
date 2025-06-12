// app/api/uploads/[filename]/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const filePath = path.join(process.cwd(), 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse(null, { status: 404 });
  }

  const file = fs.readFileSync(filePath);
  const fileExtension = path.extname(filename).slice(1);

  return new NextResponse(file, {
    headers: {
      'Content-Type': `image/${fileExtension}`,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}