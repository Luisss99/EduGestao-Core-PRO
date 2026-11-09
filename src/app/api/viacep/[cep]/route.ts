import { NextResponse } from 'next/server';
import { fetchAddressByCep } from '@/lib/viacep';

export async function GET(
  request: Request,
  { params }: { params: { cep: string } }
) {
  const address = await fetchAddressByCep(params.cep);
  if (!address) {
    return NextResponse.json({ error: 'CEP não encontrado' }, { status: 404 });
  }
  return NextResponse.json(address);
}
