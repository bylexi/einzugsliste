import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request) {
  const { name, description, link, image_url } = await request.json()

  const { data, error } = await supabase
    .from('items')
    .insert([{ name, description, link, image_url }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
