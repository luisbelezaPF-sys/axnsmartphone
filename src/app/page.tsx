'use client';

import { useState, useEffect } from 'react';
import { Phone, Star, Clock, Shield, Smartphone, MessageCircle, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  estoque: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [agendamento, setAgendamento] = useState({
    nome: '',
    telefone: '',
    modelo: '',
    servico: '',
    data: '',
    hora: ''
  });
  const { addToCart, cartItems, getCartTotal } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .limit(6);
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleAgendamento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('agendamentos')
        .insert([agendamento]);
      
      if (error) throw error;
      
      // Enviar para WhatsApp
      const message = `*Agendamento de Manutenção*\n\nNome: ${agendamento.nome}\nTelefone: ${agendamento.telefone}\nModelo: ${agendamento.modelo}\nServiço: ${agendamento.servico}\nData: ${agendamento.data}\nHora: ${agendamento.hora}`;
      const whatsappUrl = `https://wa.me/5535997335859?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      setAgendamento({ nome: '', telefone: '', modelo: '', servico: '', data: '', hora: '' });
      alert('Agendamento enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao agendar:', error);
      alert('Erro ao agendar. Tente novamente.');
    }
  };

  const sendToWhatsApp = (product?: Product) => {
    let message = '';
    if (product) {
      message = `Olá! Tenho interesse no ${product.nome} - R$ ${product.preco.toFixed(2)}`;
    } else {
      message = 'Olá! Gostaria de saber mais sobre os produtos da AXN Smartphones!';
    }
    const whatsappUrl = `https://wa.me/5535997335859?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const nome = formData.get('nome') as string;
    const telefone = formData.get('telefone') as string;
    const mensagem = formData.get('mensagem') as string;
    
    const message = `*Contato via Site*\n\nNome: ${nome}\nTelefone: ${telefone}\nMensagem: ${mensagem}`;
    const whatsappUrl = `https://wa.me/5535997335859?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => sendToWhatsApp()}
          className="bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 animate-pulse"
          aria-label="Falar no WhatsApp"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#F47C2C] rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1C1C1C]">AXN Smartphones</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-[#1C1C1C] hover:text-[#F47C2C] font-medium transition-colors">Início</a>
              <a href="#catalogo" className="text-[#1C1C1C] hover:text-[#F47C2C] font-medium transition-colors">Catálogo</a>
              <a href="#manutencao" className="text-[#1C1C1C] hover:text-[#F47C2C] font-medium transition-colors">Manutenção</a>
              <a href="#sobre" className="text-[#1C1C1C] hover:text-[#F47C2C] font-medium transition-colors">Sobre</a>
              <a href="#contato" className="text-[#1C1C1C] hover:text-[#F47C2C] font-medium transition-colors">Contato</a>
              <a href="/admin" className="bg-[#F47C2C] text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">Admin</a>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <a 
                href="https://wa.me/5535997335859" 
                target="_blank"
                className="bg-[#25D366] text-white p-2 rounded-lg hover:bg-[#20BA5A] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-[#1C1C1C] p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t bg-white py-4 space-y-2">
              <a href="#inicio" className="block px-4 py-2 text-[#1C1C1C] hover:text-[#F47C2C] hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Início</a>
              <a href="#catalogo" className="block px-4 py-2 text-[#1C1C1C] hover:text-[#F47C2C] hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Catálogo</a>
              <a href="#manutencao" className="block px-4 py-2 text-[#1C1C1C] hover:text-[#F47C2C] hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Manutenção</a>
              <a href="#sobre" className="block px-4 py-2 text-[#1C1C1C] hover:text-[#F47C2C] hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Sobre</a>
              <a href="#contato" className="block px-4 py-2 text-[#1C1C1C] hover:text-[#F47C2C] hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Contato</a>
              <a href="/admin" className="block mx-4 mt-2 bg-[#F47C2C] text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-center" onClick={() => setIsMenuOpen(false)}>Painel Admin</a>
            </div>
          )}
        </div>
      </header>

      {/* Main Hero Section */}
      <section id="inicio" className="py-12 md:py-20 bg-gradient-to-br from-[#F5F5F5] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C1C1C] leading-tight">
                  Compre seu smartphone premium 
                  <span className="text-[#F47C2C]"> sem sair de casa</span>
                </h1>
                <p className="text-base md:text-lg text-[#B3B3B3] leading-relaxed">
                  Rápido, seguro e garantido. iPhones novos e seminovos com qualidade premium e atendimento especializado.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="#catalogo"
                  className="bg-[#F47C2C] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Ver modelos disponíveis
                </a>
                <button
                  onClick={() => sendToWhatsApp()}
                  className="bg-[#25D366] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:bg-[#20BA5A] transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Falar no WhatsApp</span>
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 md:space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#F47C2C]" />
                  <span className="text-sm text-[#B3B3B3]">Garantia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-[#F47C2C]" />
                  <span className="text-sm text-[#B3B3B3]">Entrega rápida</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-[#F47C2C]" />
                  <span className="text-sm text-[#B3B3B3]">5 estrelas</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Product Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#F47C2C]/10 to-transparent rounded-3xl p-6 md:p-8">
                <img 
                  src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=600&fit=crop" 
                  alt="iPhone Premium" 
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-2 md:-top-4 -right-2 md:-right-4 bg-[#F47C2C] text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg animate-bounce">
                Novos modelos
              </div>
              <div className="absolute -bottom-2 md:-bottom-4 -left-2 md:-left-4 bg-white text-[#1C1C1C] px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg border">
                Garantia premium
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="catalogo" className="py-12 md:py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-4">
              Nossos <span className="text-[#F47C2C]">produtos</span>
            </h2>
            <p className="text-base md:text-lg text-[#B3B3B3]">iPhones premium com garantia e qualidade certificada</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105">
                <div className="aspect-square bg-[#F5F5F5] rounded-xl mb-4 overflow-hidden">
                  <img 
                    src={product.imagem} 
                    alt={product.nome}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#1C1C1C] mb-2">{product.nome}</h3>
                <p className="text-[#B3B3B3] mb-4 text-sm">{product.descricao}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl md:text-2xl font-bold text-[#F47C2C]">
                    R$ {product.preco.toFixed(2)}
                  </span>
                  <span className="text-xs md:text-sm text-[#B3B3B3]">
                    {product.estoque} em estoque
                  </span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-[#F47C2C] text-white py-2 md:py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
                  >
                    Adicionar ao carrinho
                  </button>
                  <button
                    onClick={() => sendToWhatsApp(product)}
                    className="w-full bg-[#25D366] text-white py-2 md:py-3 rounded-xl font-semibold hover:bg-[#20BA5A] transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Comprar via WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Column Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-16">
            
            {/* Left Column - Testimonials */}
            <div className="space-y-6 md:space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-4">
                  Clientes <span className="text-[#F47C2C]">satisfeitos</span>
                </h2>
                <p className="text-[#B3B3B3]">Veja o que nossos clientes dizem sobre nossos produtos e serviços</p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-[#F5F5F5] p-4 md:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F47C2C] text-[#F47C2C]" />
                    ))}
                  </div>
                  <p className="text-[#1C1C1C] mb-3">"Excelente atendimento e produto de qualidade. Meu iPhone chegou rapidinho e funcionando perfeitamente!"</p>
                  <p className="text-sm text-[#B3B3B3] font-medium">- Maria Silva</p>
                </div>
                
                <div className="bg-[#F5F5F5] p-4 md:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F47C2C] text-[#F47C2C]" />
                    ))}
                  </div>
                  <p className="text-[#1C1C1C] mb-3">"Melhor lugar para comprar iPhone! Preço justo e garantia real. Super recomendo a AXN!"</p>
                  <p className="text-sm text-[#B3B3B3] font-medium">- João Santos</p>
                </div>
              </div>
            </div>
            
            {/* Right Column - Maintenance Form */}
            <div id="manutencao" className="space-y-6 md:space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C1C] mb-4">
                  Agende <span className="text-[#F47C2C]">manutenção</span>
                </h2>
                <p className="text-[#B3B3B3]">Técnicos especializados com peças originais</p>
              </div>
              
              <form onSubmit={handleAgendamento} className="bg-[#F5F5F5] p-6 md:p-8 rounded-2xl space-y-6 hover:shadow-lg transition-all duration-300">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={agendamento.nome}
                    onChange={(e) => setAgendamento({...agendamento, nome: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F47C2C] focus:outline-none focus:ring-2 focus:ring-[#F47C2C]/20 transition-all"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Telefone"
                    value={agendamento.telefone}
                    onChange={(e) => setAgendamento({...agendamento, telefone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F47C2C] focus:outline-none focus:ring-2 focus:ring-[#F47C2C]/20 transition-all"
                    required
                  />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <select
                    value={agendamento.modelo}
                    onChange={(e) => setAgendamento({...agendamento, modelo: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F47C2C] focus:outline-none focus:ring-2 focus:ring-[#F47C2C]/20 transition-all"
                    required
                  >
                    <option value="">Modelo do iPhone</option>
                    <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
                    <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                    <option value="iPhone 15">iPhone 15</option>
                    <option value="iPhone 14 Pro Max">iPhone 14 Pro Max</option>
                    <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                    <option value="iPhone 14">iPhone 14</option>
                    <option value="iPhone 13">iPhone 13</option>
                    <option value="Outro">Outro modelo</option>
                  </select>
                  
                  <select
                    value={agendamento.servico}
                    onChange={(e) => setAgendamento({...agendamento, servico: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F47C2C] focus:outline-none focus:ring-2 focus:ring-[#F47C2C]/20 transition-all"
                    required
                  >
                    <option value="">Tipo de serviço</option>
                    <option value="Troca de tela">Troca de tela</option>
                    <option value="Troca de bateria">Troca de bateria</option>
                    <option value="Limpeza interna">Limpeza interna</option>
                    <option value="Reparo de botões">Reparo de botões</option>
                    <option value="Outro">Outro serviço</option>
                  </select>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={agendamento.data}
                    onChange={(e) => setAgendamento({...agendamento, data: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F47C2C] focus:outline-none focus:ring-2 focus:ring-[#F47C2C]/20 transition-all"
                    required
                  />
                  <input
                    type="time"
                    value={agendamento.hora}
                    onChange={(e) => setAgendamento({...agendamento, hora: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F47C2C] focus:outline-none focus:ring-2 focus:ring-[#F47C2C]/20 transition-all"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-[#F47C2C] text-white py-3 md:py-4 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Confirmar agendamento
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-12 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-6 md:mb-8">
            Sobre a <span className="text-[#F47C2C]">AXN Smartphones</span>
          </h2>
          <p className="text-base md:text-lg text-[#B3B3B3] leading-relaxed">
            A AXN Smartphones é referência em tecnologia e confiança. Trabalhamos com iPhones novos e seminovos, 
            todos testados e com garantia. Também oferecemos manutenção premium com peças originais e atendimento rápido.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-12 md:py-20 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-4">
              Entre em <span className="text-[#F47C2C]">contato</span>
            </h2>
            <p className="text-base md:text-lg text-[#B3B3B3]">Estamos aqui para ajudar você</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <form onSubmit={handleContactForm} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome completo"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F47C2C] focus:outline-none focus:ring-2 focus:ring-[#F47C2C]/20 transition-all"
                  required
                />
                <input
                  type="tel"
                  name="telefone"
                  placeholder="Telefone"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F47C2C] focus:outline-none focus:ring-2 focus:ring-[#F47C2C]/20 transition-all"
                  required
                />
              </div>
              <textarea
                name="mensagem"
                placeholder="Sua mensagem"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F47C2C] focus:outline-none focus:ring-2 focus:ring-[#F47C2C]/20 resize-none transition-all"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-[#25D366] text-white py-3 md:py-4 rounded-xl font-semibold hover:bg-[#20BA5A] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Enviar via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1C1C] text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-[#F47C2C] rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AXN Smartphones</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <p className="text-[#B3B3B3]">WhatsApp: +55 (35) 99733-5859</p>
              <button
                onClick={() => sendToWhatsApp()}
                className="bg-[#25D366] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#20BA5A] transition-colors flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar conosco</span>
              </button>
            </div>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-[#B3B3B3] text-sm">© 2025 AXN Smartphones - Todos os direitos reservados</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}