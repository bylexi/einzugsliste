import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function POST(request) {
  const formData = await request.formData()
  const file = formData.get('file')

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const fileName = `${Date.now()}-${file.name}`
  const { error: uploadError } = await supabase.storage
    .from('item-images')
    .upload(fileName, file)

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data } = supabase.storage.from('item-images').getPublicUrl(fileName)

  return NextResponse.json({ url: data.publicUrl })
}
