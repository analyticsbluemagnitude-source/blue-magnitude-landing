/* Design Philosophy: Energia Cinética Moderna
 * - Estrutura diagonal assimétrica com elementos sobrepostos
 * - Movimento fluido com parallax sutil
 * - Paleta vibrante contando história da transformação energética
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { 
  Sun, 
  Zap, 
  TrendingDown, 
  Shield, 
  Clock, 
  Award,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Leaf,
  DollarSign,
  BarChart3,
  Battery,
  Wind,
  Wrench,
  PowerOff,
  FileText
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: ""
  });
  
  // Calculator states
  const [monthlyBill, setMonthlyBill] = useState([150]);
  const [energyPrice] = useState(0.25); // €0.25 per kWh average in Portugal
  const [solarSavings] = useState(0.80); // 80% savings
  
  // Calculate results
  const monthlyConsumption = monthlyBill[0] / energyPrice;
  const monthlySavings = monthlyBill[0] * solarSavings;
  const yearlySavings = monthlySavings * 12;
  const estimatedSystemCost = monthlyConsumption * 1.5; // Rough estimate €1.5 per kWh/month
  const paybackYears = estimatedSystemCost / yearlySavings;
  const co2Savings = (monthlyConsumption * 12 * 0.233) / 1000; // tons of CO2 per year

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Carousel slide tracking
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect(); // Set initial slide

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Auto-play carousel
  useEffect(() => {
    if (!carouselApi) return;

    const autoplay = setInterval(() => {
      carouselApi.scrollNext();
    }, 5000); // 5 seconds

    return () => clearInterval(autoplay);
  }, [carouselApi]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
      '.animate-on-scroll, .animate-fade-in, .animate-slide-left, .animate-slide-right, .animate-scale'
    );
    
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Obrigado! Entraremos em contacto em breve.");
    setFormData({ name: "", email: "", phone: "", city: "" });
  };

  const stats = [
    { value: "2", label: "Anos no Mercado", icon: Award },
    { value: "+300", label: "Instalações Realizadas", icon: CheckCircle2 },
    { value: "80%", label: "Poupança na Fatura", icon: TrendingDown },
    { value: "DGEG", label: "Certificado", icon: Shield }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Poupança Imediata",
      description: "Reduza a sua fatura de eletricidade em até 80% desde o primeiro mês de instalação."
    },
    {
      icon: Leaf,
      title: "Sustentabilidade",
      description: "Contribua para um planeta mais limpo gerando sua própria energia renovável."
    },
    {
      icon: TrendingDown,
      title: "Valorização do Imóvel",
      description: "Imóveis com energia solar valorizam até 30% no mercado."
    },
    {
      icon: Shield,
      title: "Proteção Contra Inflação",
      description: "Livre-se dos aumentos constantes nas tarifas de eletricidade."
    },
    {
      icon: BarChart3,
      title: "Retorno Garantido",
      description: "Investimento com retorno entre 4 a 6 anos e benefícios por mais de 25 anos."
    },
    {
      icon: Zap,
      title: "Tecnologia Avançada",
      description: "Painéis de última geração com monitoramento inteligente em tempo real."
    }
  ];

  const process = [
    {
      number: "01",
      title: "Análise Gratuita",
      description: "Avaliamos o seu consumo e dimensionamos o sistema ideal para a sua necessidade."
    },
    {
      number: "02",
      title: "Projeto Personalizado",
      description: "Criamos um projeto técnico completo com simulação de poupança e retorno."
    },
    {
      number: "03",
      title: "Instalação Profissional",
      description: "Equipe certificada realiza a instalação completa em até 3 dias."
    },
    {
      number: "04",
      title: "Ativação e Suporte",
      description: "Acompanhamento completo com monitoramento e suporte técnico vitalício."
    }
  ];

  const testimonials = [
    {
      name: "Carlos Mendes",
      role: "Empresário",
      text: "Instalei há 2 anos e já poupei mais de 45.000€. Melhor investimento que fiz!",
      rating: 5
    },
    {
      name: "Ana Paula Silva",
      role: "Arquiteta",
      text: "Equipe profissional, instalação rápida e sistema funcionando perfeitamente. Recomendo!",
      rating: 5
    },
    {
      name: "Roberto Oliveira",
      role: "Produtor Rural",
      text: "A poupança foi além das expectativas. Fatura de eletricidade praticamente zerada.",
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
      question: "Qual o prazo de retorno do investimento?",
      answer: "Em média, o retorno ocorre entre 4 a 6 anos, dependendo do consumo e da tarifa local de eletricidade."
    },
    {
      question: "Preciso fazer manutenção constante?",
      answer: "A manutenção é mínima. Recomendamos limpeza semestral dos painéis e inspeção anual do sistema."
    },
    {
      question: "Posso vender energia excedente?",
      answer: "Sim! Através do sistema de compensação de energia, créditos são gerados e abatidos nas próximas faturas."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/giWuxHpzJpBsYoQy.png" 
                alt="Blue Magnitude" 
                className="h-20 w-auto py-2"
              />
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#beneficios" className="text-sm font-medium hover:text-primary transition-colors">Benefícios</a>
              <a href="#como-funciona" className="text-sm font-medium hover:text-primary transition-colors">Como Funciona</a>
              <a href="#depoimentos" className="text-sm font-medium hover:text-primary transition-colors">Testemunhos</a>
              <a href="#contato" className="text-sm font-medium hover:text-primary transition-colors">Contacto</a>
            </nav>
            <Button asChild className="energy-glow">
              <a href="#orcamento">Solicitar Orçamento</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <Carousel className="w-full relative" opts={{ loop: true }} setApi={setCarouselApi}>
        <CarouselContent>
          {/* Slide 1: Energia Solar Para Empresas */}
          <CarouselItem>
            <section 
              className="relative h-[70vh] flex items-center pt-20 overflow-hidden"
              style={{
                backgroundImage: `url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/xNDlwsNzwrGMfYxS.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="container relative z-10">
                <div className="max-w-3xl space-y-6 text-white">
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    Energia Solar Para{" "}
                    <span className="text-[#6cca7d] underline decoration-4 underline-offset-8">
                      Empresas
                    </span>
                  </h1>
                  <p className="text-lg lg:text-xl leading-relaxed">
                    Na Blue Magnitude, criamos soluções de energia solar feitas à medida para o teu negócio. Reduz a tua fatura de eletricidade e junta-te às inúmeras empresas que já se conectaram ao sol com as nossas soluções sustentáveis.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-[#6cca7d] hover:bg-[#5bb96d] text-white text-lg h-14 px-8">
                      Pedir Proposta
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-white/10 hover:bg-white/20 text-white border-white">
                      Os Nossos Projetos
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>

          {/* Slide 2: Autoconsumo Residencial */}
          <CarouselItem>
            <section 
              className="relative h-[70vh] flex items-center pt-20 overflow-hidden"
              style={{
                backgroundImage: `url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/JpemZjbcbABCEYXK.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="container relative z-10">
                <div className="max-w-3xl space-y-6 text-white">
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    Autoconsumo{" "}
                    <span className="text-[#6cca7d] underline decoration-4 underline-offset-8">
                      Residencial
                    </span>
                  </h1>
                  <p className="text-lg lg:text-xl leading-relaxed">
                    Descobre as nossas soluções completas para autoconsumo com painéis solares fotovoltaicos. Reduz a tua conta de eletricidade até 70%. Vamos começar o teu projeto?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-[#6cca7d] hover:bg-[#5bb96d] text-white text-lg h-14 px-8">
                      Saber Mais
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg h-14 px-8 bg-white/10 hover:bg-white/20 text-white border-white">
                      Contacte-nos
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
              onClick={() => carouselApi?.scrollTo(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'w-12 bg-[#6cca7d]' 
                  : 'w-3 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-[#243fad] to-[#3ac6ff] text-white diagonal-section diagonal-top">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center space-y-3 animate-scale" style={{transitionDelay: `${index * 0.1}s`}}>
                  <Icon className="w-12 h-12 mx-auto mb-4 animate-pulse-glow" />
                  <div className="text-5xl font-bold">{stat.value}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-br from-[#243fad]/5 to-[#3ac6ff]/5">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Os Nossos Serviços
            </h2>
            <p className="text-xl text-muted-foreground">
              Soluções completas em energia solar para todas as suas necessidades.
            </p>
          </div>
          <TooltipProvider>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-8 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#ff9800] to-[#ff6f00] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <Zap className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold">Autoconsumo</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <p>Sistemas fotovoltaicos para consumo próprio, reduzindo a dependência da rede elétrica e a fatura de eletricidade.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-8 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#ff9800] to-[#ff6f00] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <Battery className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold">Autoconsumo Com Baterias</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <p>Sistemas com armazenamento de energia para uso noturno ou em períodos sem sol, garantindo autonomia total.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-8 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#ff9800] to-[#ff6f00] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <Wind className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold">AVAC E Climatização</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <p>Integração de sistemas de aquecimento, ventilação e ar condicionado alimentados por energia solar.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-8 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#ff9800] to-[#ff6f00] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <Wrench className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold">Manutenção</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <p>Serviços de manutenção preventiva e corretiva para garantir máxima eficiência do sistema solar.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-8 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#ff9800] to-[#ff6f00] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <PowerOff className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold">Sistemas OFF-Grid</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <p>Soluções autónomas para locais sem acesso à rede elétrica, com baterias de grande capacidade.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-8 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#ff9800] to-[#ff6f00] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <FileText className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold">Consultoria</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <p>Análise técnica e económica personalizada para identificar a melhor solução solar para o seu caso.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Porquê Escolher Energia Solar?
            </h2>
            <p className="text-xl text-muted-foreground">
              Invista no futuro com tecnologia sustentável que traz poupança real e valorização do seu património.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-8 kinetic-card hover:shadow-2xl bg-card border-2 animate-on-scroll" style={{transitionDelay: `${index * 0.15}s`}}>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3ac6ff] to-[#6cca7d] flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-24 bg-gradient-to-br from-[#6cca7d]/10 to-[#d7e028]/10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Calcule a Sua Poupança
            </h2>
            <p className="text-xl text-muted-foreground">
              Descubra quanto pode poupar por mês e por ano com energia solar.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <Card className="p-8 lg:p-12 kinetic-card border-2 border-[#6cca7d] animate-scale">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Input Section */}
                <div className="space-y-8">
                  <div>
                    <Label className="text-lg font-semibold mb-4 block">
                      Qual é a sua fatura mensal de eletricidade?
                    </Label>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-[#243fad]">
                          €{monthlyBill[0]}
                        </span>
                        <span className="text-muted-foreground">/mês</span>
                      </div>
                      <Slider
                        value={monthlyBill}
                        onValueChange={setMonthlyBill}
                        min={50}
                        max={500}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>€50</span>
                        <span>€500</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Consumo estimado:</strong> {Math.round(monthlyConsumption)} kWh/mês
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong className="text-foreground">Tarifa média:</strong> €{energyPrice}/kWh
                    </p>
                  </div>
                </div>
                
                {/* Results Section */}
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#6cca7d]/20 to-[#d7e028]/20 border-2 border-[#6cca7d]">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingDown className="w-6 h-6 text-[#6cca7d]" />
                      <h3 className="text-lg font-semibold">Poupança Mensal</h3>
                    </div>
                    <p className="text-4xl font-bold text-[#6cca7d]">
                      €{monthlySavings.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Com 80% de redução na fatura
                    </p>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#3ac6ff]/20 to-[#243fad]/20 border-2 border-[#3ac6ff]">
                    <div className="flex items-center gap-3 mb-3">
                      <BarChart3 className="w-6 h-6 text-[#3ac6ff]" />
                      <h3 className="text-lg font-semibold">Poupança Anual</h3>
                    </div>
                    <p className="text-4xl font-bold text-[#3ac6ff]">
                      €{yearlySavings.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Economia em 12 meses
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
                  
                  <Button asChild className="w-full energy-glow" size="lg">
                    <a href="#orcamento">Solicitar Orçamento Personalizado</a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-24 bg-background animate-fade-in">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Como Funciona o Processo
            </h2>
            <p className="text-xl text-muted-foreground">
              Do primeiro contato até a ativação do sistema, cuidamos de tudo para você.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                <div className="space-y-4">
                  <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#3ac6ff] to-[#d7e028] opacity-20">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
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
      <section className="py-24 bg-gradient-to-br from-[#243fad]/10 to-[#6cca7d]/10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Veja Como Instalamos
            </h2>
            <p className="text-xl text-muted-foreground">
              Acompanhe o processo completo de instalação dos nossos sistemas fotovoltaicos.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#3ac6ff] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Equipa Certificada</h4>
                  <p className="text-muted-foreground">Técnicos especializados e certificados pela DGEG</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#6cca7d] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Equipamentos Premium</h4>
                  <p className="text-muted-foreground">Painéis e inversores de marcas líderes mundiais</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#d7e028] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold mb-1">Instalação Rápida</h4>
                  <p className="text-muted-foreground">Sistema completo operacional em até 3 dias</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl kinetic-card bg-black">
                <video
                  className="w-full h-auto max-h-[700px]"
                  controls
                  preload="metadata"
                  poster="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/wzfZTzfswIpbfnoS.jpg"
                >
                  <source src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/wFcAYExYViImqLCG.mp4" type="video/mp4" />
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
      <section className="py-24 bg-gradient-to-br from-[#6cca7d]/10 to-[#d7e028]/10">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/q5sviWRou2JGIIHcxzxwoX/sandbox/EwlI46E21FiSAhws1TmOi1-img-3_1771360510000_na1fn_aGFwcHktZmFtaWx5LXNvbGFy.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcTVzdmlXUm91MkpHSUlIY3h6eHdvWC9zYW5kYm94L0V3bEk0NkUyMUZpU0Fod3MxVG1PaTEtaW1nLTNfMTc3MTM2MDUxMDAwMF9uYTFmbl9hR0Z3Y0hrdFptRnRhV3g1TFhOdmJHRnkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=fPdiUJiQ5e9yORwXoM7HzkTAhH8vzt8jty9wLgylzgmpxt2gT9HxoFeCKCjjCl-xRJd6rTxzRJ1s9HKvIQ8Q9HnrRR67NZAwCkqhyagCrn3hFHAghIrHoQk2k7LdiCkQRl~eDi96hnOWp3bgy-lEDYhH9bZefXG-PHNlFTMRPWj9DqM2IA7Hz6B2PJM~ppq4nhRtBAXzzuH4wKe9HqSLqc95CQ7gTz99kxetvXi90FIHvn1RNuA275Xne4t6~GGmrbXeoEo91L2vKRS86LltlVIJFFsKVYi-fk582kmA3D30Vx1p2IEpWfbDtte3VZihgqmURqttUxZbzRdWKkXibg__"
                alt="Família Feliz com Energia Solar"
                className="rounded-3xl shadow-2xl"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Mais de 300 Famílias Já Poupam Connosco
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Junte-se às centenas de portugueses que já transformaram as suas casas em centrais de energia limpa 
                e estão a poupar na fatura de eletricidade todos os meses. Empresa certificada pela DGEG.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#6cca7d] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Instalação Rápida</h4>
                    <p className="text-muted-foreground">Sistema completo instalado em até 3 dias úteis.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#3ac6ff] flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Garantia Estendida</h4>
                    <p className="text-muted-foreground">25 anos de garantia nos painéis e 10 anos nos inversores.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#d7e028] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Suporte Vitalício</h4>
                    <p className="text-muted-foreground">Acompanhamento e suporte técnico durante toda vida útil do sistema.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Projetos de Clientes
            </h2>
            <p className="text-xl text-muted-foreground">
              Conheça algumas das mais de 300 instalações solares que já realizamos em Portugal.
            </p>
          </div>
          {/* Featured Project Summary */}
          <Card className="p-8 mb-12 bg-gradient-to-br from-[#243fad]/10 to-[#3ac6ff]/10 border-2 border-[#3ac6ff] animate-slide-left">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">Projeto Mata Mourisca</h3>
                <div className="space-y-3 text-lg">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Sistema:</strong> 7 painéis solares Aiko 450W com inversor híbrido Solplanet ASW4000H
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Armazenamento:</strong> Bateria Sunwoda Monawall 5,12 kW
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Resultado:</strong> Energia renovável consistente com autonomia total, mesmo durante a noite
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/wzfZTzfswIpbfnoS.jpg"
                  alt="Projeto Mata Mourisca - Instalação"
                  className="rounded-xl shadow-lg w-full h-auto object-cover"
                />
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/runBWVaITLbvTBCm.jpg"
                  alt="Projeto Mata Mourisca - Painéis Completos"
                  className="rounded-xl shadow-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </Card>
          
          {/* Second Featured Project */}
          <Card className="p-8 mb-12 bg-gradient-to-br from-[#6cca7d]/10 to-[#d7e028]/10 border-2 border-[#6cca7d] animate-slide-right">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/WVgFGcHSCvZpgfeD.jpg"
                  alt="Projeto Autoconsumo - Instalação"
                  className="rounded-xl shadow-lg w-full h-auto object-cover"
                />
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/aKenSoiHHZUobuqN.jpg"
                  alt="Projeto Autoconsumo - Painéis Completos"
                  className="rounded-xl shadow-lg w-full h-auto object-cover"
                />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">Projeto Autoconsumo de Alto Desempenho</h3>
                <div className="space-y-3 text-lg">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Sistema:</strong> 20 painéis solares Aiko 605W com inversor Fox ESS H3-Pro 20.0
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Armazenamento:</strong> Baterias Fox ESS Energy Cube 2900 (11,6 kW total)
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Resultado:</strong> Autonomia energética maximizada com fornecimento contínuo e estável
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] kinetic-card">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/JBfLRaTDPyOmSYTB.jpg"
                alt="Sistema Residencial Completo"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-bold mb-2">Telhado Metálico</h3>
                  <p className="text-sm opacity-90">Adaptação para diversos tipos de cobertura</p>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] kinetic-card">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/mjIFhCQRvUScOGio.jpg"
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
            <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] kinetic-card">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/bJReAHxZrjozkZKi.jpg"
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
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              O Que os Nossos Clientes Dizem
            </h2>
            <p className="text-xl text-muted-foreground">
              Testemunhos reais de quem já está a poupar com energia solar.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
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
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-muted-foreground">
              Tire suas dúvidas sobre energia solar.
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Form Section */}
      <section id="orcamento" className="py-24 bg-gradient-to-br from-[#243fad] to-[#3ac6ff] text-white diagonal-section diagonal-top animate-fade-in">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Solicite o Seu Orçamento Gratuito
              </h2>
              <p className="text-xl opacity-90">
                Preencha o formulário e receba uma proposta personalizada em até 24 horas.
              </p>
            </div>
            <Card className="p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input 
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="O seu nome"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      placeholder="o-seu@email.pt"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                    <Input 
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      placeholder="(00) 00000-0000"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input 
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                      placeholder="A sua cidade"
                      className="h-12"
                    />
                  </div>
                </div>
                <Button type="submit" size="lg" className="w-full h-14 text-lg energy-glow">
                  Receber Orçamento Gratuito
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Ao enviar, concorda em receber contacto da Blue Magnitude sobre a sua solicitação.
                </p>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold">
                Entre em Contacto
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                A nossa equipa está pronta para esclarecer as suas dúvidas e ajudá-lo a dar o primeiro passo 
                rumo à independência energética.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#3ac6ff]/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-[#3ac6ff]" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Telefone</div>
                    <a href="tel:+351999999999" className="text-muted-foreground hover:text-primary transition-colors">
                      +351 999 999 999
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#6cca7d]/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#6cca7d]" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">E-mail</div>
                    <a href="mailto:contato@bluemagnitude.com.br" className="text-muted-foreground hover:text-primary transition-colors">
                      contato@bluemagnitude.com.br
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#d7e028]/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-[#d7e028]" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Endereço</div>
                    <p className="text-muted-foreground">
                      Lisboa, Portugal
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/q5sviWRou2JGIIHcxzxwoX/sandbox/EwlI46E21FiSAhws1TmOi1-img-5_1771360500000_na1fn_dGVjaG5vbG9neS1pbm5vdmF0aW9u.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcTVzdmlXUm91MkpHSUlIY3h6eHdvWC9zYW5kYm94L0V3bEk0NkUyMUZpU0Fod3MxVG1PaTEtaW1nLTVfMTc3MTM2MDUwMDAwMF9uYTFmbl9kR1ZqYUc1dmJHOW5lUzFwYm01dmRtRjBhVzl1LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=P70RTxZy8RDxPxq5KmccRCLhSVM5yktDy1ZlsKowt~tBv6VjEt6UwqKyZI4oZ1ERVLvrnO6dxZQi4MGGRDxi-tEVcmukImsmDBYMYRQlfNENn8Sm1JI5jlrbl4DcxDt-FamEyWvD~ElXWM69TgSLAzA4qwUo6~FOkhWxpCV38KvQiN~~ZBTTTwyvrl5Fgt9gBs-n9e20Zq6etGyHWTmBMtTsMkLxk4U-TNpqOdDd0DY9n60k1oBkQ19IrD~B1FZJvkqQLxMX9Ws5UZf6RjvYIQsjMEYuPtpGH7infqmcsPv8w73yaU2Hb~hx4htU7r12KT8p8oDiFuSR8Z2BWF50bg__"
                alt="Tecnologia Solar Avançada"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#243fad] text-white">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/giWuxHpzJpBsYoQy.png" 
                alt="Blue Magnitude" 
                className="h-12 w-auto brightness-0 invert"
              />
              <p className="text-sm opacity-80">
                A transformar luz solar em poupança e sustentabilidade. Certificados pela DGEG.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Navegação</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#beneficios" className="hover:opacity-100 transition-opacity">Benefícios</a></li>
                <li><a href="#como-funciona" className="hover:opacity-100 transition-opacity">Como Funciona</a></li>
                <li><a href="#depoimentos" className="hover:opacity-100 transition-opacity">Testemunhos</a></li>
                <li><a href="#contato" className="hover:opacity-100 transition-opacity">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Serviços</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Instalação Residencial</li>
                <li>Instalação Comercial</li>
                <li>Instalação Industrial</li>
                <li>Manutenção Preventiva</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>+351 999 999 999</li>
                <li>contacto@bluemagnitude.pt</li>
                <li>Lisboa, Portugal</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/20 text-center text-sm opacity-80">
            <p>&copy; 2026 Blue Magnitude. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
