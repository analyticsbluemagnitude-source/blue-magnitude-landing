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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  FileText,
  Menu,
  X,
  ChevronDown,
  MessageCircle,
  ChevronUp
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { FormSuccessDialog } from "@/components/FormSuccessDialog";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [scrollY, setScrollY] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [testimonialsApi, setTestimonialsApi] = useState<CarouselApi>();
  const [currentTestimonialSlide, setCurrentTestimonialSlide] = useState(0);
  const [projectsApi, setProjectsApi] = useState<CarouselApi>();
  const [currentProjectSlide, setCurrentProjectSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: ""
  });
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successDialogType, setSuccessDialogType] = useState<"quote" | "contact">("quote");
  const [showScrollTop, setShowScrollTop] = useState(false);
  
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
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Testimonials carousel tracking
  useEffect(() => {
    if (!testimonialsApi) return;

    const onSelect = () => {
      setCurrentTestimonialSlide(testimonialsApi.selectedScrollSnap());
    };

    testimonialsApi.on("select", onSelect);
    onSelect();

    return () => {
      testimonialsApi.off("select", onSelect);
    };
  }, [testimonialsApi]);

  // Projects carousel tracking
  useEffect(() => {
    if (!projectsApi) return;

    const onSelect = () => {
      setCurrentProjectSlide(projectsApi.selectedScrollSnap());
    };

    projectsApi.on("select", onSelect);
    onSelect();

    return () => {
      projectsApi.off("select", onSelect);
    };
  }, [projectsApi]);

  // Auto-play carousel
  useEffect(() => {
    if (!carouselApi || isPaused) return;

    const autoplay = setInterval(() => {
      carouselApi.scrollNext();
    }, 5000); // 5 seconds

    return () => clearInterval(autoplay);
  }, [carouselApi, isPaused]);

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

  // tRPC mutations para envio de formulários
  const submitQuoteMutation = trpc.forms.submitQuote.useMutation({
    onSuccess: () => {
      setFormData({ name: "", email: "", phone: "", city: "" });
      setSuccessDialogType("quote");
      setShowSuccessDialog(true);
      
      // Google Analytics 4 event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          event_category: 'Formulário',
          event_label: 'Orçamento Gratuito',
          value: 1
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar formulário. Por favor, tente novamente.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuoteMutation.mutate(formData);
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
          <div className="flex items-center justify-between h-21">
            <div className="flex items-center gap-2">
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/giWuxHpzJpBsYoQy.png" 
                alt="Blue Magnitude" 
                className="h-20 w-auto py-2"
              />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#beneficios" className="text-sm font-medium hover:text-primary transition-colors">Benefícios</a>
              <a href="#como-funciona" className="text-sm font-medium hover:text-primary transition-colors">Como Funciona</a>
              <a href="#depoimentos" className="text-sm font-medium hover:text-primary transition-colors">Testemunhos</a>
              <a href="#contato" className="text-sm font-medium hover:text-primary transition-colors">Contacto</a>
            </nav>
            
            {/* Desktop CTA Button */}
            <Button asChild className="hidden md:flex energy-glow">
              <a href="#orcamento">Solicitar Orçamento</a>
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
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <nav className="container py-4 flex flex-col gap-4">
              <a 
                href="#beneficios" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefícios
              </a>
              <a 
                href="#como-funciona" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Como Funciona
              </a>
              <a 
                href="#depoimentos" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testemunhos
              </a>
              <a 
                href="#contato" 
                className="text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </a>
              <Button asChild className="energy-glow w-full" onClick={() => setMobileMenuOpen(false)}>
                <a href="#orcamento">Solicitar Orçamento</a>
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Carousel Section */}
      <Carousel 
        className="w-full relative" 
        opts={{ loop: true }} 
        setApi={setCarouselApi}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <CarouselContent>
          {/* Slide 1: Energia Solar Para Empresas */}
          <CarouselItem>
            <section 
              className="relative h-[60vh] flex items-center pt-20 overflow-hidden"
              style={{
                backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/q5sviWRou2JGIIHcxzxwoX/sandbox/REFC4GPOzcnFnppBcZZ4PK-img-1_1771368547000_na1fn_aGVyby1zbGlkZS1lbXByZXNhcw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcTVzdmlXUm91MkpHSUlIY3h6eHdvWC9zYW5kYm94L1JFRkM0R1BPemNuRm5wcEJjWlo0UEstaW1nLTFfMTc3MTM2ODU0NzAwMF9uYTFmbl9hR1Z5YnkxemJHbGtaUzFsYlhCeVpYTmhjdy5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=kqFYNL84SMuooRgeCk5pOajXXRXeItwClRA8Gzs4zDclE8ckZI3Q1C5Bk7XXFYMOpgHOBxbczWR3VT~Sgmq1uCyNUeiB4Hmw3K0a~9cNr2RbPST0Os3sWk2NMPYUC-SUW7awmyUHjgGdVEGMvdHYRTgrrOY7w9r1TTgEmXdlfWbRT~-hQsc6lNkCKIISmoXAhbIVe3kgluv3rbiHgyFb4CzpSdqEkpgzkx07bRfWum5su3iz416ZA2ty~KB2AjzyE6Nv4wpT7oR4mGVOtaxosxwAiySieR1k9qiSI8ZdSD-q7F25-JG19kefT1lyxktqKA2qAfPNm4d9-zefIPS~lg__')`,
                backgroundSize: '120%',
                backgroundPosition: 'center 40%'
              }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="container relative z-10">
                <div className="max-w-3xl space-y-6 text-white">
                  <h1 className="text-xl lg:text-3xl font-bold leading-tight slide-title">
                    Energia Solar Para{" "}
                    <span className="text-[#6cca7d] underline decoration-4 underline-offset-8">
                      Empresas
                    </span>
                  </h1>
                  <p className="text-base lg:text-lg leading-relaxed slide-description">
                    Na Blue Magnitude, criamos soluções de energia solar feitas à medida para o teu negócio. Reduz a tua fatura de eletricidade e junta-te às inúmeras empresas que já se conectaram ao sol com as nossas soluções sustentáveis.
                  </p>
                  <div className="slide-button">
                    <Button size="lg" className="energy-glow text-white text-base h-12 px-6">
                      Pedir Proposta
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>

          {/* Slide 2: Autoconsumo Residencial */}
          <CarouselItem>
            <section 
              className="relative h-[60vh] flex items-center pt-20 overflow-hidden"
              style={{
                backgroundImage: `url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/kLqSkJQspwvNxSOz.jpg')`,
                backgroundSize: '130%',
                backgroundPosition: 'center 35%'
              }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="container relative z-10">
                <div className="max-w-3xl space-y-6 text-white">
                  <h1 className="text-xl lg:text-3xl font-bold leading-tight slide-title">
                    Autoconsumo{" "}
                    <span className="text-[#6cca7d] underline decoration-4 underline-offset-8">
                      Residencial
                    </span>
                  </h1>
                  <p className="text-base lg:text-lg leading-relaxed slide-description">
                    Descobre as nossas soluções completas para autoconsumo com painéis solares fotovoltaicos. Reduz a tua conta de eletricidade até 80%. Vamos começar o teu projeto?
                  </p>
                  <div className="slide-button">
                    <Button size="lg" className="energy-glow text-white text-base h-12 px-6">
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
          <ChevronDown className="w-8 h-8 text-white/80" />
        </button>
      </Carousel>

      {/* Services Section */}
      <section id="servicos" className="py-10 bg-gradient-to-br from-[#243fad]/5 to-[#3ac6ff]/5">
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
            <div className="grid md:grid-cols-2 gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#6cca7d] to-[#5bb96d] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <Zap className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-bold">Autoconsumo</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <p>Sistemas fotovoltaicos para consumo próprio, reduzindo a dependência da rede elétrica e a fatura de eletricidade.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#6cca7d] to-[#5bb96d] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <Battery className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-bold">Autoconsumo Com Baterias</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <p>Sistemas com armazenamento de energia para uso noturno ou em períodos sem sol, garantindo autonomia total.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#6cca7d] to-[#5bb96d] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <Wind className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-bold">AVAC E Climatização</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <p>Integração de sistemas de aquecimento, ventilação e ar condicionado alimentados por energia solar.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#6cca7d] to-[#5bb96d] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <Wrench className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-bold">Manutenção</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <p>Serviços de manutenção preventiva e corretiva para garantir máxima eficiência do sistema solar.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#6cca7d] to-[#5bb96d] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <PowerOff className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-bold">Sistemas OFF-Grid</h3>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <p>Soluções autónomas para locais sem acesso à rede elétrica, com baterias de grande capacidade.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-4 kinetic-card hover:shadow-2xl bg-gradient-to-br from-[#6cca7d] to-[#5bb96d] text-white cursor-pointer transition-all duration-300 hover:scale-105 animate-scale">
                    <FileText className="w-8 h-8 mb-2" />
                    <h3 className="text-lg font-bold">Consultoria</h3>
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
      <section id="beneficios" className="py-10 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 animate-on-scroll">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Porquê Escolher Energia Solar?
            </h2>
            <p className="text-base text-muted-foreground">
              Invista no futuro com tecnologia sustentável que traz poupança real e valorização do seu património.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 kinetic-card hover:shadow-2xl bg-card border-2 animate-on-scroll" style={{transitionDelay: `${index * 0.15}s`}}>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3ac6ff] to-[#6cca7d] flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-10 bg-gradient-to-br from-[#6cca7d]/10 to-[#d7e028]/10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-8 space-y-2 animate-on-scroll">
            <h2 className="text-xl lg:text-2xl font-bold">
              Calcule a Sua Poupança
            </h2>
            <p className="text-sm text-muted-foreground">
              Descubra quanto pode poupar por mês e por ano com energia solar.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 lg:p-8 kinetic-card border-2 border-[#6cca7d] animate-scale">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Qual é a sua fatura mensal de eletricidade?
                    </Label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-[#243fad]">
                          €{monthlyBill[0]}
                        </span>
                        <span className="text-muted-foreground">/mês</span>
                      </div>
                      <Slider
                        value={monthlyBill}
                        onValueChange={(value) => {
                          setMonthlyBill(value);
                          
                          // Google Analytics 4 event
                          if (typeof window !== 'undefined' && (window as any).gtag) {
                            (window as any).gtag('event', 'calculator_used', {
                              event_category: 'Calculadora',
                              event_label: 'Ajuste de Valor',
                              value: value[0]
                            });
                          }
                        }}
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
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#6cca7d]/20 to-[#d7e028]/20 border-2 border-[#6cca7d]">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-[#6cca7d]" />
                      <h3 className="text-base font-semibold">Poupança Mensal</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#6cca7d]">
                      €{monthlySavings.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Com 80% de redução na fatura
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#3ac6ff]/20 to-[#243fad]/20 border-2 border-[#3ac6ff]">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-5 h-5 text-[#3ac6ff]" />
                      <h3 className="text-base font-semibold">Poupança Anual</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#3ac6ff]">
                      €{yearlySavings.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Economia em 12 meses
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">Retorno do Investimento</p>
                      <p className="text-xl font-bold text-[#243fad]">
                        {paybackYears.toFixed(1)} anos
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground mb-1">CO₂ Evitado/Ano</p>
                      <p className="text-xl font-bold text-[#6cca7d]">
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
      <section id="como-funciona" className="py-10 bg-background animate-fade-in">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="text-2xl lg:text-3xl font-bold">
              Como Funciona o Processo
            </h2>
            <p className="text-base text-muted-foreground">
              Do primeiro contato até a ativação do sistema, cuidamos de tudo para você.
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
      <section className="py-10 bg-gradient-to-br from-[#243fad]/10 to-[#6cca7d]/10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-6 space-y-2">
            <h2 className="text-xl lg:text-2xl font-bold">
              Veja Como Instalamos
            </h2>
            <p className="text-sm text-muted-foreground">
              Acompanhe o processo completo de instalação dos nossos sistemas fotovoltaicos.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#3ac6ff] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-0.5">Equipa Certificada</h4>
                  <p className="text-xs text-muted-foreground">Técnicos especializados e certificados pela DGEG</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6cca7d] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-0.5">Equipamentos Premium</h4>
                  <p className="text-xs text-muted-foreground">Painéis e inversores de marcas líderes mundiais</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d7e028] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-0.5">Instalação Rápida</h4>
                  <p className="text-xs text-muted-foreground">Sistema completo operacional em até 3 dias</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl kinetic-card bg-black">
                <video
                  className="w-full h-auto max-h-[350px]"
                  controls
                  preload="metadata"
                  poster="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/lSuvGiPJAIfNVQds.jpg"
                >
                  <source src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/wFcAYExYViImqLCG.mp4" type="video/mp4" />
                  O seu navegador não suporta a reprodução de vídeos.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-10 bg-gradient-to-br from-[#6cca7d]/10 to-[#d7e028]/10">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-6 space-y-2">
            <h2 className="text-xl lg:text-2xl font-bold">
              Mais de 300 Famílias Já Poupam Connosco
            </h2>
            <p className="text-sm text-muted-foreground">
              Junte-se às centenas de portugueses que já transformaram as suas casas em centrais de energia limpa.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6cca7d] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-0.5">Instalação Rápida</h4>
                  <p className="text-xs text-muted-foreground">Sistema completo instalado em até 3 dias úteis</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#3ac6ff] flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-0.5">Garantia Estendida</h4>
                  <p className="text-xs text-muted-foreground">25 anos de garantia nos painéis e 10 anos nos inversores</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d7e028] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-0.5">Suporte Vitalício</h4>
                  <p className="text-xs text-muted-foreground">Acompanhamento e suporte técnico durante toda vida útil</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <img 
                src="https://private-us-east-1.manuscdn.com/sessionFile/q5sviWRou2JGIIHcxzxwoX/sandbox/EwlI46E21FiSAhws1TmOi1-img-3_1771360510000_na1fn_aGFwcHktZmFtaWx5LXNvbGFy.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcTVzdmlXUm91MkpHSUlIY3h6eHdvWC9zYW5kYm94L0V3bEk0NkUyMUZpU0Fod3MxVG1PaTEtaW1nLTNfMTc3MTM2MDUxMDAwMF9uYTFmbl9hR0Z3Y0hrdFptRnRhV3g1TFhOdmJHRnkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=fPdiUJiQ5e9yORwXoM7HzkTAhH8vzt8jty9wLgylzgmpxt2gT9HxoFeCKCjjCl-xRJd6rTxzRJ1s9HKvIQ8Q9HnrRR67NZAwCkqhyagCrn3hFHAghIrHoQk2k7LdiCkQRl~eDi96hnOWp3bgy-lEDYhH9bZefXG-PHNlFTMRPWj9DqM2IA7Hz6B2PJM~ppq4nhRtBAXzzuH4wKe9HqSLqc95CQ7gTz99kxetvXi90FIHvn1RNuA275Xne4t6~GGmrbXeoEo91L2vKRS86LltlVIJFFsKVYi-fk582kmA3D30Vx1p2IEpWfbDtte3VZihgqmURqttUxZbzRdWKkXibg__"
                alt="Família Feliz com Energia Solar"
                className="rounded-2xl shadow-2xl w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-10 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-xl lg:text-2xl font-bold">
              Projetos de Clientes
            </h2>
            <p className="text-sm text-muted-foreground">
              Conheça algumas das mais de 300 instalações solares que já realizamos em Portugal.
            </p>
          </div>
          
          <div className="relative">
          <Carousel className="w-full" opts={{ loop: true }} setApi={setProjectsApi}>
            <CarouselContent>
              {/* Projeto 1: Mata Mourisca */}
              <CarouselItem>
                <Card className="p-6 bg-gradient-to-br from-[#243fad]/10 to-[#3ac6ff]/10 border-2 border-[#3ac6ff]">
                  <div className="grid lg:grid-cols-2 gap-6 items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-3">Projeto Mata Mourisca</h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Sistema:</strong> 7 painéis Aiko 450W + Solplanet ASW4000H
                        </p>
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Armazenamento:</strong> Bateria Sunwoda 5,12 kW
                        </p>
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Resultado:</strong> Autonomia total 24h
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <img 
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/wzfZTzfswIpbfnoS.jpg"
                        alt="Projeto Mata Mourisca - Depois"
                        className="rounded-xl shadow-lg w-full h-auto object-cover"
                        loading="lazy"
                      />
                      <img 
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/runBWVaITLbvTBCm.jpg"
                        alt="Projeto Mata Mourisca - Antes"
                        className="rounded-xl shadow-lg w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </Card>
              </CarouselItem>
              
              {/* Projeto 2: Autoconsumo Alto Desempenho */}
              <CarouselItem>
                <Card className="p-6 bg-gradient-to-br from-[#6cca7d]/10 to-[#d7e028]/10 border-2 border-[#6cca7d]">
                  <div className="grid lg:grid-cols-2 gap-6 items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-3">Autoconsumo Alto Desempenho</h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Sistema:</strong> 20 painéis Aiko 605W + Fox ESS H3-Pro 20.0
                        </p>
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Armazenamento:</strong> Baterias Fox ESS 11,6 kW
                        </p>
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Resultado:</strong> Máxima autonomia energética
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <img 
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/WVgFGcHSCvZpgfeD.jpg"
                        alt="Projeto Autoconsumo"
                        className="rounded-xl shadow-lg w-full h-auto max-h-[200px] object-cover"
                        loading="lazy"
                      />
                      <img 
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/aKenSoiHHZUobuqN.jpg"
                        alt="Projeto Autoconsumo - Painéis"
                        className="rounded-xl shadow-lg w-full h-auto max-h-[200px] object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </Card>
              </CarouselItem>
              
              {/* Projeto 3: Instalação Comercial */}
              <CarouselItem>
                <Card className="p-6 bg-gradient-to-br from-[#d7e028]/10 to-[#6cca7d]/10 border-2 border-[#d7e028]">
                  <div className="grid lg:grid-cols-2 gap-6 items-center">
                    <div>
                      <h3 className="text-xl font-bold mb-3">Instalação Comercial</h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Sistema:</strong> 15 painéis Aiko 550W + Fox ESS H3-Pro 15.0
                        </p>
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Armazenamento:</strong> Baterias Fox ESS 9,6 kW
                        </p>
                        <p className="text-muted-foreground">
                          <strong className="text-foreground">Resultado:</strong> Redução de 75% nos custos energéticos
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <img 
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/mjIFhCQRvUScOGio.jpg"
                        alt="Projeto Comercial"
                        className="rounded-xl shadow-lg w-full h-auto object-cover"
                        loading="lazy"
                      />
                      <img 
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/JBfLRaTDPyOmSYTB.jpg"
                        alt="Telhado Metálico"
                        className="rounded-xl shadow-lg w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
          
          {/* Dots Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(3)].map((_, index) => (
              <button
                key={index}
                onClick={() => projectsApi?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  currentProjectSlide === index 
                    ? 'w-8 bg-[#6cca7d]' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-6 bg-background">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-xl lg:text-2xl font-bold">
              O Que os Nossos Clientes Dizem
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <Carousel className="w-full" opts={{ loop: true }} setApi={setTestimonialsApi}>
              <CarouselContent>
                {/* Video Testimonial Slide */}
                <CarouselItem>
                  <div className="rounded-xl overflow-hidden shadow-2xl">
                    <video
                      className="w-full h-auto max-h-[350px]"
                      controls
                      poster="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/aSoVwIwDLKcGIJXi.png"
                    >
                      <source src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/GakVTWAQclLNENtl.mp4" type="video/mp4" />
                      O seu navegador não suporta a reprodução de vídeos.
                    </video>
                  </div>
                </CarouselItem>
                
                {/* Text Testimonials Slides */}
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index}>
                    <Card className="p-8 kinetic-card h-full flex flex-col justify-center">
                      <div className="flex gap-1 mb-4 justify-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Sun key={i} className="w-5 h-5 fill-[#d7e028] text-[#d7e028]" />
                        ))}
                      </div>
                      <p className="text-lg mb-6 leading-relaxed italic text-center">"{testimonial.text}"</p>
                      <div className="text-center">
                        <div className="font-bold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
            
            {/* Dots Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(testimonials.length + 1)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => testimonialsApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentTestimonialSlide === index 
                      ? 'w-8 bg-[#3ac6ff]' 
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-xl lg:text-2xl font-bold">
              Perguntas Frequentes
            </h2>
            <p className="text-sm text-muted-foreground">
              Tire suas dúvidas sobre energia solar.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-bold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Form Section */}
      <section id="orcamento" className="py-10 bg-gradient-to-br from-[#243fad] to-[#3ac6ff] text-white diagonal-section diagonal-top animate-fade-in">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 lg:p-8">
              <div className="text-center mb-4 space-y-1">
                <h2 className="text-xl lg:text-2xl font-bold text-foreground">
                  Solicite o Seu Orçamento Gratuito
                </h2>
                <p className="text-sm text-muted-foreground">
                  Preencha o formulário e receba uma proposta personalizada em até 24 horas.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome e Apelido *</Label>
                    <Input 
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      placeholder="Nome e apelido completo"
                      className="h-10"
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
                      className="h-10"
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
                      placeholder="+351 938 719 773"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Localidade *</Label>
                    <Input 
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                      placeholder="Cidade ou vila"
                      className="h-10"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 text-sm font-semibold energy-glow text-white flex items-center justify-center gap-3 px-8">
                  <span>Receber Orçamento Gratuito</span>
                  <ArrowRight className="w-5 h-5" />
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
      <section id="contato" className="py-10 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h2 className="text-2xl lg:text-3xl font-bold">
                Entre em Contacto
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
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
                    <a href="tel:+351938719773" className="text-muted-foreground hover:text-primary transition-colors">
                      +351 938 719 773
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#6cca7d]/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#6cca7d]" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">E-mail</div>
                    <a href="mailto:geral@bluemagnitude.pt" className="text-muted-foreground hover:text-primary transition-colors">
                      geral@bluemagnitude.pt
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
                      Estr. de Pinheiros 480, 2415-776 Leiria
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl max-h-[400px]">
              <video
                className="w-full h-auto max-h-[400px]"
                controls
                preload="metadata"
              >
                <source src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663364459713/ukIRBkuSHcqRYrNL.mp4" type="video/mp4" />
                O seu navegador não suporta a reprodução de vídeos.
              </video>
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
                className="h-20 w-auto brightness-0 invert"
              />
              <p className="text-sm opacity-80">
                Fazemos circular energia. Certificados pela DGEG.
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
                <li>+351 938 719 773</li>
                <li>geral@bluemagnitude.pt</li>
                <li>Estr. de Pinheiros 480, 2415-776 Leiria</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/20 text-center text-sm opacity-80">
            <p>&copy; 2026 Blue Magnitude. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-3 bottom-24 z-50 bg-gradient-to-br from-[#243fad] to-[#3ac6ff] hover:from-[#1e3490] hover:to-[#2ba5d9] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-in fade-in slide-in-from-bottom-5"
          aria-label="Voltar ao Topo"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/351938719773"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-3 top-1/2 -translate-y-1/2 z-50 bg-[#25D366] hover:bg-[#1eaa50] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 whatsapp-button"
        aria-label="Contacte-nos pelo WhatsApp"
        onClick={() => {
          // Google Analytics 4 event
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'click', {
              event_category: 'WhatsApp',
              event_label: 'Botão Flutuante',
              value: 1
            });
          }
        }}
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Success Dialog */}
      <FormSuccessDialog 
        open={showSuccessDialog} 
        onOpenChange={setShowSuccessDialog}
        formType={successDialogType}
      />
    </div>
  );
}
