import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Product {
  id: number
  nome: string
  descricao: string
  preco: number
  imagem: string
  estoque: number
  created_at?: string
}

export interface Agendamento {
  id: number
  nome: string
  telefone: string
  modelo: string
  servico: string
  data: string
  hora: string
  status?: string
  created_at?: string
}

export interface Usuario {
  id: number
  email: string
  senha: string
  created_at?: string
}