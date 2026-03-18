import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

// Assets de imágenes optimizadas
import slider01 from "../assets/images/portadaHome-optimized.webp";
import slider02 from "../assets/images/portadaHomeSec.webp";
import slider02mobile from "../assets/images/slider-02-mobile.webp";

// Tipos
interface SlideData {
    id: number;
    title: string;
    description?: string;
    image:
        | string
        | { src: string }
        | { desktop: string | { src: string }; mobile: string | { src: string } };
    cta: {
        text: string;
        href: string;
    };
}

interface SliderHomeProps {
    slides?: SlideData[];
    autoplayInterval?: number;
    className?: string;
}

// Datos de slides por defecto
const defaultSlides: SlideData[] = [
    {
        id: 1,
        title: "URIBE FITZGERALD y Cia.",
        image: slider01,
        cta: {
            text: "Contáctanos",
            href: "#contacto",
        },
    },
    {
        id: 2,
        title: "Compromiso y experiencia a tu servicio",
        description:
            "Profesionales unidos para defender tus derechos y acompañarte en cada etapa del proceso legal.",
        image: {
            desktop: slider02,
            mobile: slider02mobile,
        },
        cta: {
            text: "Ver Servicios",
            href: "#servicios",
        },
    },
];

// Variantes de animación con Framer Motion
const slideVariants = {
    enter: {
        opacity: 0,
        scale: 1.05,
    },
    center: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.5,
            ease: [0.42, 0, 1, 1] as const,
        },
    },
};

const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: custom * 0.15,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as const,
        },
    }),
};

export const SliderHome: React.FC<SliderHomeProps> = ({
    slides = defaultSlides,
    autoplayInterval = 8000,
    className = "",
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const totalSlides = slides.length;

    // Navegación
    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, [totalSlides]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    }, [totalSlides]);

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    // Autoplay
    useEffect(() => {
        if (isPaused || totalSlides <= 1) return;

        const interval = setInterval(goToNext, autoplayInterval);
        return () => clearInterval(interval);
    }, [isPaused, autoplayInterval, goToNext, totalSlides]);

    // Navegación por teclado
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                e.preventDefault();
                goToPrevious();
            } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                e.preventDefault();
                goToNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [goToNext, goToPrevious]);

    // Gestos táctiles
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientY);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientY);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isUpSwipe = distance > minSwipeDistance;
        const isDownSwipe = distance < -minSwipeDistance;

        if (isUpSwipe) {
            goToNext();
        } else if (isDownSwipe) {
            goToPrevious();
        }
    };

    const currentSlide = slides[currentIndex];

    // Type guard para imagen responsive
    const isResponsiveImage = (
        img: SlideData["image"],
    ): img is { desktop: string | { src: string }; mobile: string | { src: string } } => {
        return (
            typeof img === "object" &&
            img !== null &&
            "desktop" in img &&
            "mobile" in img
        );
    };

    // Helper para extraer URL de imagen
    const getImageUrl = (img: string | { src: string }) => {
        return typeof img === "string" ? img : img.src;
    };

    // Determinar URLs según tipo de imagen
    const imageUrl = isResponsiveImage(currentSlide.image)
        ? getImageUrl(currentSlide.image.desktop)
        : typeof currentSlide.image === "string"
          ? currentSlide.image
          : currentSlide.image.src;

    const mobileImageUrl = isResponsiveImage(currentSlide.image)
        ? getImageUrl(currentSlide.image.mobile)
        : imageUrl;

    return (
        <section
            className={`relative w-full h-screen overflow-hidden ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            role="region"
            aria-label="Slider principal"
            aria-live="polite"
        >
            {/* Contenedor de Slides con AnimatePresence */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide.id}
                    className="absolute inset-0 w-full h-full"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                >
                    {/* Imagen de fondo responsive */}
                    {isResponsiveImage(currentSlide.image) ? (
                        <picture className="absolute inset-0">
                            {/* Imagen para móviles (< 768px) */}
                            <source
                                media="(max-width: 767px)"
                                srcSet={mobileImageUrl}
                            />
                            {/* Imagen para desktop (>= 768px) */}
                            <source media="(min-width: 768px)" srcSet={imageUrl} />
                            {/* Fallback para navegadores sin soporte de picture */}
                            <img
                                src={imageUrl}
                                alt={currentSlide.title}
                                className="w-full h-full object-cover object-center"
                            />
                        </picture>
                    ) : (
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                    )}

                    {/* Overlay oscuro */}
                    <div className="absolute inset-0 bg-black/50 z-10" />

                    {/* Contenido del slide */}
                    <div className="container mx-auto flex flex-col items-center justify-center h-full relative z-20 px-6">
                        <div className="text-center max-w-4xl">
                            {/* Título animado */}
                            <motion.p
                                className="tituloH1Alternative mb-6 uppercase"
                                custom={0}
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {currentSlide.title}
                            </motion.p>

                            {/* Descripción animada */}
                            <motion.p
                                className="text-white text-lg md:text-[26px] font-light mb-8 leading-relaxed"
                                custom={1}
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {currentSlide.description}
                            </motion.p>

                            {/* Botón CTA animado */}
                            <motion.a
                                href={currentSlide.cta.href}
                                className="btn-slider px-8 py-4 inline-block"
                                custom={2}
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {currentSlide.cta.text}
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Dots de navegación verticales a la derecha */}
            {totalSlides > 1 && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-[2px] border-2 border-white/50 transition-all duration-300 hover:scale-125 ${
                                index === currentIndex
                                    ? "bg-primary border-primary scale-125"
                                    : "bg-white/30 hover:bg-white/50"
                            }`}
                            aria-label={`Ir al slide ${index + 1}`}
                            aria-current={index === currentIndex ? "true" : "false"}
                        />
                    ))}
                </div>
            )}

            {/* Contador para móviles */}
            {totalSlides > 1 && (
                <div className="absolute bottom-8 right-8 z-30 lg:hidden">
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span className="text-white text-sm font-medium">
                            {currentIndex + 1} / {totalSlides}
                        </span>
                    </div>
                </div>
            )}

            {/* Anuncio para lectores de pantalla */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                Slide {currentIndex + 1} de {totalSlides}: {currentSlide.title}
            </div>
        </section>
    );
};
