'use client'

import { useState, useEffect } from 'react'
import { supabase, Product, Agendamento } from '@/lib/supabase'
import { Plus, Edit, Trash2, Calendar, Package, Users, Eye, Check, X } from 'lucide-react'

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('produtos')
  const [products, setProducts] = useState<Product[]>([])
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Verificar autenticação
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('axn-admin-logged')
    if (isLoggedIn === 'true') {
      setIsAuthenticated(true)
      loadData()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const senha = formData.get('senha') as string

    // Login simples (em produção, usar hash da senha)
    if (email === 'admin' && senha === 'matheus25') {
      localStorage.setItem('axn-admin-logged', 'true')
      setIsAuthenticated(true)
      loadData()
    } else {
      alert('Credenciais inválidas!')
    }
  }

  const loadData = async () => {
    try {
      // Carregar produtos
      const { data: productsData } = await supabase
        .from('produtos')
        .select('*')
        .order('id')
      
      if (productsData) setProducts(productsData)

      // Carregar agendamentos
      const { data: agendamentosData } = await supabase
        .from('agendamentos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (agendamentosData) setAgendamentos(agendamentosData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const productData = {
      nome: formData.get('nome') as string,
      descricao: formData.get('descricao') as string,
      preco: parseFloat(formData.get('preco') as string),
      imagem: formData.get('imagem') as string,
      estoque: parseInt(formData.get('estoque') as string)
    }

    try {
      if (editingProduct) {
        // Atualizar produto
        await supabase
          .from('produtos')
          .update(productData)
          .eq('id', editingProduct.id)
      } else {
        // Criar novo produto
        await supabase
          .from('produtos')
          .insert([productData])
      }

      setShowProductForm(false)
      setEditingProduct(null)
      loadData()
      alert(editingProduct ? 'Produto atualizado!' : 'Produto criado!')
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar produto!')
    }
  }

  const deleteProduct = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      await supabase
        .from('produtos')
        .delete()
        .eq('id', id)
      
      loadData()
      alert('Produto excluído!')
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      alert('Erro ao excluir produto!')
    }
  }

  const updateAgendamentoStatus = async (id: number, status: string) => {
    try {
      await supabase
        .from('agendamentos')
        .update({ status })
        .eq('id', id)
      
      loadData()
      alert(`Agendamento ${status}!`)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status!')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-[#1C1C1C] mb-6 text-center">
            Painel Administrativo
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1C1C1C] mb-2">
                Usuário
              </label>
              <input
                type="text"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F47C2C] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1C1C1C] mb-2">
                Senha
              </label>
              <input
                type="password"
                name="senha"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F47C2C] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#F47C2C] text-white py-3 rounded-lg font-semibold hover:bg-[#e06b1f] transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-[#1C1C1C]">
              Painel Administrativo - AXN Smartphones
            </h1>
            <button
              onClick={() => {
                localStorage.removeItem('axn-admin-logged')
                setIsAuthenticated(false)
              }}
              className="text-[#F47C2C] hover:text-[#e06b1f] transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8">
          {[
            { id: 'produtos', label: 'Produtos', icon: Package },
            { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#F47C2C] text-white'
                    : 'text-[#1C1C1C] hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Produtos */}
        {activeTab === 'produtos' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1C1C1C]">Gerenciar Produtos</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="bg-[#F47C2C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#e06b1f] transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Produto</span>
              </button>
            </div>

            <div className="grid gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-6">
                  <img
                    src={product.imagem}
                    alt={product.nome}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1C1C1C]">{product.nome}</h3>
                    <p className="text-[#B3B3B3] mb-2">{product.descricao}</p>
                    <div className="flex items-center space-x-4">
                      <span className="text-[#F47C2C] font-bold">
                        R$ {product.preco.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-sm text-[#B3B3B3]">
                        Estoque: {product.estoque}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product)
                        setShowProductForm(true)
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agendamentos */}
        {activeTab === 'agendamentos' && (
          <div>
            <h2 className="text-2xl font-bold text-[#1C1C1C] mb-6">Gerenciar Agendamentos</h2>
            
            <div className="grid gap-4">
              {agendamentos.map(agendamento => (
                <div key={agendamento.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#1C1C1C]">{agendamento.nome}</h3>
                      <p className="text-[#B3B3B3]">{agendamento.telefone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      agendamento.status === 'confirmado' 
                        ? 'bg-green-100 text-green-800'
                        : agendamento.status === 'cancelado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {agendamento.status || 'Pendente'}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-[#B3B3B3]">Modelo</p>
                      <p className="font-medium">{agendamento.modelo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#B3B3B3]">Serviço</p>
                      <p className="font-medium">{agendamento.servico}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#B3B3B3]">Data</p>
                      <p className="font-medium">{agendamento.data}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#B3B3B3]">Hora</p>
                      <p className="font-medium">{agendamento.hora}</p>
                    </div>
                  </div>

                  {agendamento.status !== 'confirmado' && agendamento.status !== 'cancelado' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateAgendamentoStatus(agendamento.id, 'confirmado')}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Confirmar</span>
                      </button>
                      <button
                        onClick={() => updateAgendamentoStatus(agendamento.id, 'cancelado')}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Produto */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-[#1C1C1C]">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#1C1C1C] mb-2">
                  Nome do produto
                </label>
                <input
                  type="text"
                  name="nome"
                  required
                  defaultValue={editingProduct?.nome || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F47C2C] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C1C1C] mb-2">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  required
                  rows={3}
                  defaultValue={editingProduct?.descricao || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F47C2C] focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-2">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    name="preco"
                    required
                    step="0.01"
                    defaultValue={editingProduct?.preco || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F47C2C] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1C] mb-2">
                    Estoque
                  </label>
                  <input
                    type="number"
                    name="estoque"
                    required
                    defaultValue={editingProduct?.estoque || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F47C2C] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C1C1C] mb-2">
                  URL da imagem
                </label>
                <input
                  type="url"
                  name="imagem"
                  required
                  defaultValue={editingProduct?.imagem || ''}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F47C2C] focus:border-transparent"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#F47C2C] text-white py-3 rounded-lg font-semibold hover:bg-[#e06b1f] transition-colors"
                >
                  {editingProduct ? 'Atualizar' : 'Criar'} Produto
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false)
                    setEditingProduct(null)
                  }}
                  className="flex-1 border border-gray-300 text-[#1C1C1C] py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}