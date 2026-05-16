import { NextResponse } from 'next/server'
import supabase from '@/lib/supabase'

export async function PATCH(request, { params }) {
  const { id } = params
  const { is_purchased } = await request.json()

  const { data, error } = await supabase
    .from('items')
    .update({ is_purchased })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const { id } = params

  const { error } = await supabase.from('items').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
