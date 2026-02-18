import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Zap, Battery, Wind, Wrench, PowerOff, FileText, Sun, CheckCircle2, Shield, Clock, TrendingDown, BarChart3, Menu, X, ChevronDown, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savings, setSavings] = useState(0);
  const [systemSize, setSystemSize] = useState(5);

  useEffect(() => {
    if (carouselApi) {
      carouselApi.on('select', () => {
        setCurrentSlide(carouselApi.selectedScrollSnap());
      });
    }
  }, [carouselApi]);

  const process = [
    {
      number: "01",
      title: "Análise e Orçamento",
      description: "Avaliamos o seu imóvel, consumo energético e potencial solar para criar uma solução personalizada."
    },
    {
      number: "02",
      title: "Instalação Profissional",
      description: "Nossa equipa experiente realiza a instalação com qualidade e segurança, minimizando perturbações."
    },
    {
      number: "03",
      title: "Monitoramento Contínuo",
      description: "Sistema de monitoramento em tempo real permite acompanhar a produção e poupança gerada."
    },
    {
      number: "04",
      title: "Suporte Permanente",
      description: "Manutenção preventiva e suporte técnico garantem o funcionamento ótimo do seu sistema."
    }
  ];

  const benefits = [
    {
      icon: TrendingDown,
      title: "Redução de Custos",
      description: "Diminua significativamente sua fatura de eletricidade com energia renovável."
    },
    {
      icon: Shield,
      title: "Proteção Contra Apagões",
      description: "Sistemas com bateria garantem energia mesmo durante interrupções da rede."
    },
    {
      icon: Clock,
      title: "Rápido Retorno",
      description: "Recupere seu investimento em 5-8 anos e aproveite décadas de poupança."
    },
    {
      icon: CheckCircle2,
      title: "Sustentabilidade",
      description: "Contribua para um futuro mais verde reduzindo sua pegada de carbono."
    }
  ];

  const testimonials = [
    {
      name: "Tiago Pinto",
      role: "Cliente Blue Magnitude",
      text: "Após uma má experiência de um fornecedor de energia anterior, encontrei a Bluemagnitude, e graças ao estudo do Ivo Santos e ao profissionalismo da equipa, o meu sistema solar funciona perfeitamente, mesmo num apartamento, e agora estou a economizar e protegido contra apagões. Recomendo!",
      rating: 5
    },
    {
      name: "Maria Costa",
      role: "Proprietária Residencial",
      text: "Instalação rápida e profissional. O sistema funciona perfeitamente e já estou a ver a diferença na fatura de eletricidade. Muito satisfeita!",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Quanto tempo dura um sistema de energia solar?",
      answer: "Os painéis solares têm vida útil de 25 a 30 anos, mantendo mais de 80% da eficiência. Os inversores duram de 10 a 15 anos."
    },
    {
      question: "O sistema funciona em dias nublados?",
      answer: "Sim! Mesmo em dias nublados os painéis captam luz difusa e geram energia, embora com eficiência reduzida."
    },
    {
      question: "Qual é o custo de manutenção?",
      answer: "A manutenção é mínima. Recomendamos limpeza anual dos painéis e inspeção do sistema. Custos são muito inferiores às economias geradas."
    },
    {
      question: "Posso vender o excesso de energia?",
      answer: "Sim, através do sistema de compensação de energia (net metering), você pode vender o excedente gerado para a rede elétrica."
    },
    {
      question: "Funciona à noite?",
      answer: "Durante a noite, o sistema não gera energia. Com baterias de armazenamento, você pode usar a energia acumulada durante o dia."
    },
    {
      question: "Qual é o investimento inicial?",
      answer: "O investimento varia conforme o tamanho do sistema. Oferecemos opções de financiamento para tornar acessível a energia solar."
    }
  ];

  const paybackYears = systemSize * 1.2;
  const co2Savings = systemSize * 4.5;

  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between h-21">
            <div className="flex items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#243fad] to-[#3ac6ff] flex items-center justify-center">
                <span className="text-white font-bold text-sm">Blue Magnitude</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#beneficios" className="text-foreground hover:text-accent transition-colors">Benefícios</a>
              <a href="#como-funciona" className="text-foreground hover:text-accent transition-colors">Como Funciona</a>
              <a href="#depoimentos" className="text-foreground hover:text-accent transition-colors">Testemunhos</a>
              <a href="#contato" className="text-foreground hover:text-accent transition-colors">Contacto</a>
            </nav>

            <Button className="hidden md:flex bg-[#243fad] hover:bg-[#1a2d7d] text-white">
              Solicitar Orçamento
            </Button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <nav className="container py-4 flex flex-col gap-4">
              <a 
                href="#beneficios" 
                className="text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefícios
              </a>
              <a 
                href="#como-funciona" 
                className="text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Como Funciona
              </a>
              <a 
                href="#depoimentos" 
                className="text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testemunhos
              </a>
              <a 
                href="#contato" 
                className="text-foreground hover:text-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </a>
              <Button className="w-full bg-[#243fad] hover:bg-[#1a2d7d] text-white">
                Solicitar Orçamento
              </Button>
            </nav>
          </div>
        )}
        </div>
      </header>

      {/* Carousel */}
      <Carousel setApi={setCarouselApi} className="relative">
        <CarouselContent>
          <CarouselItem>
            <section 
              className="relative h-[60vh] flex items-center pt-20 overflow-hidden"
              style={{
                backgroundImage: `url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/kLqSkJQspwvNxSOz.jpg')`,
                backgroundSize: '130%',
                backgroundPosition: 'center 40%'
              }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="container relative z-10">
                <div className="max-w-3xl space-y-6 text-white">
                  <h1 className="text-2xl lg:text-4xl font-bold leading-tight">
                    Energia Solar Para{" "}
                    <span className="text-[#6cca7d] underline decoration-4 underline-offset-8">
                      Empresas
                    </span>
                  </h1>
                  <p className="text-base lg:text-lg leading-relaxed">
                    Na Blue Magnitude, criamos soluções de energia solar feitas à medida para o teu negócio. Reduz a tua fatura de eletricidade e junta-te às inúmeras empresas que já se conectaram ao sol com as nossas soluções sustentáveis.
                  </p>
                  <div>
                    <Button size="lg" className="bg-[#6cca7d] hover:bg-[#5bb96d] text-white text-base h-12 px-6">
                      Pedir Proposta
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>

          <CarouselItem>
            <section 
              className="relative h-[60vh] flex items-center pt-20 overflow-hidden"
              style={{
                backgroundImage: `url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/DJI_0125-1536x864.jpg')`,
                backgroundSize: '130%',
                backgroundPosition: 'center 35%'
              }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="container relative z-10">
                <div className="max-w-3xl space-y-6 text-white">
                  <h1 className="text-2xl lg:text-4xl font-bold leading-tight">
                    Autoconsumo{" "}
                    <span className="text-[#6cca7d] underline decoration-4 underline-offset-8">
                      Residencial
                    </span>
                  </h1>
                  <p className="text-base lg:text-lg leading-relaxed">
                    Descobre as nossas soluções completas para autoconsumo com painéis solares fotovoltaicos. Reduz a tua conta de eletricidade até 70%. Vamos começar o teu projeto?
                  </p>
                  <div>
                    <Button size="lg" className="bg-[#6cca7d] hover:bg-[#5bb96d] text-white text-base h-12 px-6">
                      Pedir Proposta
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/30 text-white border-white" />
        <CarouselNext className="right-4 bg-white/20 hover:bg-white/30 text-white border-white" />
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {[0, 1].map((index) => (
            <button
              key={index}
              onClick={() => carouselApi?.scrollTo?.(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'w-12 bg-[#6cca7d]' 
                  : 'w-3 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Scroll Down Indicator */}
        <button 
          onClick={() => {
            const servicesSection = document.querySelector('#servicos');
            if (servicesSection) {
              servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 animate-bounce cursor-pointer hover:scale-110 transition-transform"
          aria-label="Rolar para baixo"
        >
          <ChevronDown className="w-8 h-8 text-white" />
        </button>
      </Carousel>

      {/* Services Section */}
      <section id="servicos" className="py-16 bg-gradient-to-br from-[#243fad]/5 to-[#3ac6ff]/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 animate-on-scroll">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Os Nossos Serviços
            </h2>
            <p className="text-base text-muted-foreground">
              Soluções completas em energia solar para todas as suas necessidades.
            </p>
          </div>
          <TooltipProvider>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#6cca7d] to-[#5bb96d] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <Zap className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-bold">Autoconsumo</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>Sistemas de energia solar para consumo próprio</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#6cca7d] to-[#5bb96d] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <Battery className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-bold">Autoconsumo Com Baterias</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>Armazenamento de energia para uso noturno</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#6cca7d] to-[#5bb96d] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <Wind className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-bold">AVAC E Climatização</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>Sistemas de climatização eficientes</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#6cca7d] to-[#5bb96d] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <Wrench className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-bold">Manutenção</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>Serviços de manutenção preventiva e corretiva</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#6cca7d] to-[#5bb96d] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <PowerOff className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-bold">Sistemas OFF-Grid</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>Sistemas independentes da rede elétrica</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#6cca7d] to-[#5bb96d] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <FileText className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-bold">Consultoria</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>Análise e consultoria especializada</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 animate-on-scroll">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Porquê Escolher Energia Solar?
            </h2>
            <p className="text-base text-muted-foreground">
              Benefícios comprovados para o seu bolso e para o planeta.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 kinetic-card hover:shadow-2xl bg-card border-2 animate-on-scroll" style={{transitionDelay: `${index * 0.15}s`}}>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3ac6ff] to-[#6cca7d] flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{benefit.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-gradient-to-br from-[#6cca7d]/10 to-[#d7e028]/10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 animate-on-scroll">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Calcule a Sua Poupança
            </h2>
            <p className="text-base text-muted-foreground">
              Descubra quanto pode economizar com energia solar.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl p-8 border-2 border-[#6cca7d]">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3">Tamanho do Sistema (kW)</label>
                  <input 
                    type="range" 
                    min="3" 
                    max="20" 
                    value={systemSize}
                    onChange={(e) => setSystemSize(Number(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>3 kW</span>
                    <span className="font-bold text-foreground">{systemSize} kW</span>
                    <span>20 kW</span>
                  </div>
                </div>
                
                {/* Results Section */}
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#6cca7d]/20 to-[#d7e028]/20 border-2 border-[#6cca7d]">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingDown className="w-6 h-6 text-[#6cca7d]" />
                      <h3 className="text-lg font-semibold">Poupança Mensal</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#6cca7d]">
                      ~€{(systemSize * 45).toFixed(0)}/mês
                    </p>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#3ac6ff]/20 to-[#243fad]/20 border-2 border-[#3ac6ff]">
                    <div className="flex items-center gap-3 mb-3">
                      <BarChart3 className="w-6 h-6 text-[#3ac6ff]" />
                      <h3 className="text-lg font-semibold">Poupança Anual</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#3ac6ff]">
                      ~€{(systemSize * 540).toFixed(0)}/ano
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">Retorno do Investimento</p>
                      <p className="text-2xl font-bold text-[#243fad]">
                        {paybackYears.toFixed(1)} anos
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">CO₂ Evitado/Ano</p>
                      <p className="text-2xl font-bold text-[#6cca7d]">
                        {co2Savings.toFixed(1)}t
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-16 bg-background animate-fade-in">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Como Funciona o Processo
            </h2>
            <p className="text-base text-muted-foreground">
              Desde a análise até à instalação, acompanhamos cada passo.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="space-y-4">
                  <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#3ac6ff] to-[#d7e028] opacity-20">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#3ac6ff] to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-gradient-to-br from-[#243fad]/10 to-[#6cca7d]/10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Veja Como Instalamos
            </h2>
            <p className="text-base text-muted-foreground">
              Processo profissional de instalação de sistemas solares.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#3ac6ff] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Avaliação Completa</h4>
                  <p className="text-sm text-muted-foreground">Análise detalhada do local e potencial solar</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#6cca7d] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Instalação Rápida</h4>
                  <p className="text-sm text-muted-foreground">Equipa profissional e experiente</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#d7e028] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Garantia Total</h4>
                  <p className="text-sm text-muted-foreground">Suporte e manutenção contínua</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl kinetic-card bg-black">
                <video
                  className="w-full h-auto max-h-[700px]"
                  controls
                  poster="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/DJI_0125-1536x864.jpg"
                >
                  <source src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/VID_20250121_142020_0.mp4" type="video/mp4" />
                  O seu navegador não suporta a reprodução de vídeos.
                </video>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#3ac6ff] to-[#d7e028] rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-[#6cca7d] to-[#243fad] rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gradient-to-br from-[#6cca7d]/10 to-[#d7e028]/10">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-6">
                Porque Nos Escolhem
              </h2>
              <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                Mais de 2 anos de experiência, 300+ instalações realizadas e clientes satisfeitos em toda a região. Somos parceiros de marcas líderes em energia solar e certificados pela DGEG.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#6cca7d] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Experiência Comprovada</h4>
                    <p className="text-sm text-muted-foreground">Mais de 2 anos ajudando clientes a economizar</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#3ac6ff] flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Garantia de Qualidade</h4>
                    <p className="text-sm text-muted-foreground">Equipamentos de marcas premium certificadas</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#d7e028] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Suporte 24/7</h4>
                    <p className="text-sm text-muted-foreground">Equipa disponível para qualquer dúvida</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-6 bg-card rounded-xl border-2 border-[#6cca7d]">
                <p className="text-3xl font-bold text-[#6cca7d] mb-2">300+</p>
                <p className="text-sm text-muted-foreground">Instalações Realizadas</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border-2 border-[#3ac6ff]">
                <p className="text-3xl font-bold text-[#3ac6ff] mb-2">2+</p>
                <p className="text-sm text-muted-foreground">Anos de Experiência</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border-2 border-[#d7e028]">
                <p className="text-3xl font-bold text-[#d7e028] mb-2">80%</p>
                <p className="text-sm text-muted-foreground">Poupança Média</p>
              </div>
              <div className="text-center p-6 bg-card rounded-xl border-2 border-[#243fad]">
                <p className="text-3xl font-bold text-[#243fad] mb-2">✓</p>
                <p className="text-sm text-muted-foreground">Certificado DGEG</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 animate-on-scroll">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Projetos de Clientes
            </h2>
            <p className="text-base text-muted-foreground">
              Conheça alguns dos nossos projetos realizados com sucesso.
            </p>
          </div>
          {/* Featured Project Summary */}
          <Card className="p-8 mb-12 bg-gradient-to-br from-[#243fad]/10 to-[#3ac6ff]/10 border-2 border-[#3ac6ff] animate-slide-left">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Projeto Mata Mourisca</h3>
                <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                  Instalação de sistema solar residencial com armazenamento em bateria. Resultado: Energia renovável consistente com autonomia total, mesmo durante a noite
                </p>
              </div>
              <div className="space-y-4">
                <div className="group relative overflow-hidden rounded-xl">
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/wzfZTzfswIpbfnoS.jpg"
                    alt="Projeto Mata Mourisca - Instalação"
                    className="rounded-xl shadow-lg w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-start justify-start p-6">
                    <span className="text-white text-3xl font-bold">DEPOIS</span>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-xl">
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/runBWVaITLbvTBCm.jpg"
                    alt="Projeto Mata Mourisca - Painéis Completos"
                    className="rounded-xl shadow-lg w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-start justify-start p-6">
                    <span className="text-white text-3xl font-bold">ANTES</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Second Featured Project */}
          <Card className="p-8 mb-12 bg-gradient-to-br from-[#6cca7d]/10 to-[#d7e028]/10 border-2 border-[#6cca7d] animate-slide-right">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/IMG_20250121_142020_0.jpg"
                  alt="Autoconsumo de Alto Desempenho"
                  className="rounded-xl shadow-lg w-full h-auto object-cover max-h-[280px]"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Autoconsumo de Alto Desempenho</h3>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                  Sistema de grande capacidade para consumo industrial. Redução de 80% na fatura de eletricidade com retorno do investimento em 5 anos.
                </p>
              </div>
            </div>
          </Card>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden rounded-xl h-64 cursor-pointer">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/IMG_20250121_142020_0.jpg"
                alt="Telhado Metálico"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">Telhado Metálico</h3>
                  <p className="text-sm opacity-90">Adaptação para diversos tipos de cobertura</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl h-64 cursor-pointer">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/IMG_20250121_142020_0.jpg"
                alt="Instalação Comercial"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">Projeto Comercial</h3>
                  <p className="text-sm opacity-90">Soluções para empresas e indústrias</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl h-64 cursor-pointer">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/IMG_20250121_142020_0.jpg"
                alt="Sistema de Grande Porte"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">Grande Porte</h3>
                  <p className="text-sm opacity-90">Sistemas de alta capacidade para grandes consumos</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl h-64 cursor-pointer">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/q5sviWRou2JGIIHcxzxwoX/sandbox/naqrcvcQxtrVwZaHNxmMoq-img-2_1771420127000_na1fn_bWF0YS1tb3VyaXNjYS1hbnRlcw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcTVzdmlXUm91MkpHSUlIY3h6eHdvWC9zYW5kYm94L25hcXJjdmNReHRyVndaYUhOeG1Nb3EtaW1nLTJfMTc3MTQyMDEyNzAwMF9uYTFmbl9iV0YwWVMxdGIzVnlhWE5qWVMxaGJuUmxjdy5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=SnMzimmeVhUURhwr9wqNJX~BDkLyKKQ9uD3OYK55aqc9vjsoyX7pzXrjsmbfG3j7r~ZODmQPZx6VqTokx8c~KeHimhDqQ6~DQoPbCvB6N7wMA4u8P6K5NZZ-TmrA7uk6WcJPYlCP0AYo-FIsi3DD60xCVy81xmNZDBG~RzNEEyAm3hRGIpF4~MVYz59ZCoBJstT1b~7WKT0huVlWgCANeuHhLMFVFYLVkC3SjpgssfOaA-GSW-vxJxiq~QSDSKuakRhIwq~nzpAlphMgr-YhD-efl-vYQfKjfcAXrfRTMnuovg6hXlaz-L4VQKDV5YapuNh-zOJr6GT09D4pyqk3Fg__"
                alt="Bateria Solplanet de Armazenamento"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">Armazenamento</h3>
                  <p className="text-sm opacity-90">Energia garantida à noite, dias sem sol e sem eletricidade. Baterias armazenam o excedente para independência energética</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-16 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">
              O Que os Nossos Clientes Dizem
            </h2>
            <p className="text-base text-muted-foreground">
              Testemunhos reais de quem já está a poupar com energia solar.
            </p>
          </div>
          <div className="space-y-12">
            {/* Video Testimonial */}
            <div className="bg-gradient-to-br from-[#6cca7d]/10 to-[#3ac6ff]/10 rounded-2xl p-8 border-2 border-[#6cca7d]">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Depoimento em Vídeo</h3>
                <p className="text-base text-muted-foreground">Conheça a experiência real de Susy com a Blue Magnitude</p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-2xl mb-6">
                <video
                  className="w-full h-auto max-h-[500px]"
                  controls
                  poster="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/QTUDVHOBVvFgWvew.mp4"
                >
                  <source src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/QTUDVHOBVvFgWvew.mp4" type="video/mp4" />
                  O seu navegador não suporta a reprodução de vídeos.
                </video>
              </div>
              <div className="text-center">
                <p className="text-base text-muted-foreground italic">"A experiência de Susy com o nosso sistema solar e a dedicação da nossa equipa"</p>
              </div>
            </div>

            {/* Text Testimonials */}
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-8 kinetic-card">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Sun key={i} className="w-5 h-5 fill-[#d7e028] text-[#d7e028]" />
                    ))}
                  </div>
                  <p className="text-lg mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Perguntas Frequentes
            </h2>
            <p className="text-base text-muted-foreground">
              Respostas às dúvidas mais comuns sobre energia solar.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 kinetic-card">
                <details className="cursor-pointer">
                  <summary className="font-bold text-lg flex items-center justify-between">
                    {faq.question}
                    <span className="ml-4">+</span>
                  </summary>
                  <p className="text-muted-foreground mt-4 leading-relaxed">{faq.answer}</p>
                </details>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Form Section */}
      <section id="orcamento" className="py-16 bg-gradient-to-br from-[#243fad] to-[#3ac6ff] text-white diagonal-section diagonal-top animate-fade-in">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-2xl lg:text-3xl font-bold">
                Solicite o Seu Orçamento
              </h2>
              <p className="text-base opacity-90">
                Preencha o formulário abaixo e nossa equipa entrará em contacto em breve.
              </p>
            </div>
            <form className="grid md:grid-cols-2 gap-6">
              <input 
                type="text" 
                placeholder="Seu Nome" 
                className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
                required
              />
              <input 
                type="email" 
                placeholder="Seu Email" 
                className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
              />
              <input 
                type="tel" 
                placeholder="Seu Telefone" 
                className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
              />
              <select className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/50" defaultValue="">
                <option value="">Tipo de Instalação</option>
                <option value="residential">Residencial</option>
                <option value="commercial">Comercial</option>
                <option value="industrial">Industrial</option>
              </select>
              <textarea 
                placeholder="Mensagem (opcional)" 
                rows={4}
                className="md:col-span-2 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/50"
              ></textarea>
              <Button className="md:col-span-2 bg-white text-[#243fad] hover:bg-gray-100 text-lg h-12 font-bold">
                Enviar Orçamento
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                  Entre em Contacto
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Tem dúvidas? Nossa equipa está pronta para ajudar. Entre em contacto conosco através de qualquer um dos canais abaixo.
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#3ac6ff]/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#3ac6ff]" />
                  </div>
                  <div>
                    <h4 className="font-bold">Telefone</h4>
                    <p className="text-muted-foreground">+351 XXX XXX XXX</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#6cca7d]/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#6cca7d]" />
                  </div>
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="text-muted-foreground">info@bluemagnitude.pt</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#d7e028]/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#d7e028]" />
                  </div>
                  <div>
                    <h4 className="font-bold">Localização</h4>
                    <p className="text-muted-foreground">Portugal</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-2xl p-8 border-2 border-border">
              <h3 className="text-xl font-bold mb-6">Formulário de Contacto</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Nome" 
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6cca7d]"
                />
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6cca7d]"
                />
                <textarea 
                  placeholder="Mensagem" 
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-[#6cca7d]"
                ></textarea>
                <Button className="w-full bg-[#6cca7d] hover:bg-[#5bb96d] text-white">
                  Enviar
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#243fad] text-white">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="font-bold">Blue Magnitude</h4>
              <p className="text-sm opacity-80">Soluções de energia solar para um futuro sustentável.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Serviços</h4>
              <ul className="text-sm opacity-80 space-y-2">
                <li><a href="#" className="hover:opacity-100">Autoconsumo</a></li>
                <li><a href="#" className="hover:opacity-100">Com Baterias</a></li>
                <li><a href="#" className="hover:opacity-100">Manutenção</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Empresa</h4>
              <ul className="text-sm opacity-80 space-y-2">
                <li><a href="#" className="hover:opacity-100">Sobre Nós</a></li>
                <li><a href="#" className="hover:opacity-100">Contacto</a></li>
                <li><a href="#" className="hover:opacity-100">Blog</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold">Legal</h4>
              <ul className="text-sm opacity-80 space-y-2">
                <li><a href="#" className="hover:opacity-100">Privacidade</a></li>
                <li><a href="#" className="hover:opacity-100">Termos</a></li>
                <li><a href="#" className="hover:opacity-100">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm opacity-80">&copy; 2026 Blue Magnitude. Todos os direitos reservados.</p>
            <a 
              href="https://wa.me/351938719773"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm opacity-80 hover:opacity-100"
            >
              WhatsApp: +351 938 719 773
            </a>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/351938719773"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-3 top-1/2 -translate-y-1/2 z-50 bg-[#25D366] hover:bg-[#1eaa50] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 whatsapp-button"
        aria-label="Contacte-nos pelo WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
