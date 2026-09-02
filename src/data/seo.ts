export interface CategoriaConsulta {
    nombre: string;
    slug: string;
    descripcion: string;
}

export const categoriasConsulta: CategoriaConsulta[] = [
    {
        nombre: "Derecho Laboral",
        slug: "derecho-laboral",
        descripcion:
            "Consultas sobre despidos, finiquitos, licencias médicas, remuneraciones y derechos laborales.",
    },
    {
        nombre: "Derecho de Familia",
        slug: "derecho-familia",
        descripcion:
            "Consultas sobre pensión de alimentos, cuidado personal, visitas y causas de familia.",
    },
    {
        nombre: "Derecho Penal",
        slug: "derecho-penal",
        descripcion: "Orientación general sobre denuncias, delitos, audiencias y defensa penal.",
    },
    {
        nombre: "Derecho Civil",
        slug: "derecho-civil",
        descripcion:
            "Consultas sobre contratos, deudas, arriendos, herencias y conflictos civiles.",
    },
    {
        nombre: "Otras Consultas",
        slug: "otras-consultas",
        descripcion: "Preguntas jurídicas generales que no pertenecen a una categoría específica.",
    },
];

interface PreguntaFrecuente {
    pregunta: string;
    respuesta: string;
}

export interface ServicioSeo {
    slug: string;
    nombre: string;
    titulo: string;
    descripcion: string;
    encabezado: string;
    introduccion: string;
    situaciones: string[];
    enfoque: string;
    preguntas: PreguntaFrecuente[];
}

export const serviciosSeo: ServicioSeo[] = [
    {
        slug: "abogado-penal-puerto-montt",
        nombre: "Derecho Penal",
        titulo: "Abogado Penal en Puerto Montt | Defensa Jurídica Sur",
        descripcion:
            "Abogados penalistas en Puerto Montt para defensa, audiencias, denuncias y medidas cautelares. Evaluación profesional y atención confidencial.",
        encabezado: "Abogado penal en Puerto Montt",
        introduccion:
            "Una investigación o acusación penal exige actuar a tiempo y comprender cada decisión. Nuestro equipo analiza los antecedentes, explica las alternativas disponibles y diseña una estrategia de defensa ajustada a la etapa del procedimiento.",
        situaciones: [
            "Detenciones, formalizaciones y audiencias de control",
            "Delitos contra las personas o la propiedad",
            "Violencia intrafamiliar y maltrato habitual",
            "Delitos sexuales y Ley 20.000",
            "Medidas cautelares y recursos",
            "Responsabilidad penal adolescente",
        ],
        enfoque:
            "Revisamos la carpeta investigativa y los antecedentes que entregue la persona, identificamos plazos y riesgos, y explicamos con claridad los pasos siguientes. La estrategia definitiva depende de los hechos y de la evidencia disponible; no ofrecemos resultados garantizados.",
        preguntas: [
            {
                pregunta: "¿Cuándo conviene contactar a un abogado penal?",
                respuesta:
                    "Desde la primera citación, denuncia, detención o noticia de una investigación. La orientación temprana permite resguardar derechos y preparar adecuadamente las declaraciones y audiencias.",
            },
            {
                pregunta: "¿Atienden causas fuera de Puerto Montt?",
                respuesta:
                    "Evaluamos causas en la Región de Los Lagos y otras ciudades de Chile. La primera reunión puede realizarse de forma presencial u online.",
            },
        ],
    },
    {
        slug: "abogado-familia-puerto-montt",
        nombre: "Derecho de Familia",
        titulo: "Abogado de Familia en Puerto Montt | Defensa Jurídica Sur",
        descripcion:
            "Abogados de familia en Puerto Montt para pensiones, cuidado personal, visitas, divorcios y violencia intrafamiliar. Atención presencial y online.",
        encabezado: "Abogado de familia en Puerto Montt",
        introduccion:
            "Los conflictos familiares requieren una solución jurídica rigurosa y un trato especialmente cuidadoso. Orientamos a cada persona sobre el procedimiento aplicable, los documentos necesarios y las alternativas para proteger a niños, adolescentes y adultos involucrados.",
        situaciones: [
            "Pensión de alimentos, aumento, rebaja y cumplimiento",
            "Cuidado personal de hijos e hijas",
            "Relación directa y regular o régimen de visitas",
            "Divorcio y declaración de bien familiar",
            "Violencia intrafamiliar y medidas de protección",
            "Filiación, reclamación e impugnación de paternidad",
        ],
        enfoque:
            "Antes de iniciar una gestión revisamos antecedentes, resoluciones previas y redes de apoyo. Buscamos una estrategia comprensible y proporcional al conflicto, considerando acuerdos cuando son viables y representación judicial cuando resulta necesaria.",
        preguntas: [
            {
                pregunta: "¿Qué documentos necesito para una consulta de familia?",
                respuesta:
                    "Depende del caso, pero suelen ser útiles certificados, resoluciones judiciales anteriores, liquidaciones, comprobantes de gastos y cualquier comunicación relevante entre las partes.",
            },
            {
                pregunta: "¿La mediación familiar es siempre obligatoria?",
                respuesta:
                    "Es un trámite previo obligatorio en varias materias, como alimentos, cuidado personal y visitas, salvo excepciones legales. Revisamos si corresponde en cada caso.",
            },
        ],
    },
    {
        slug: "abogado-laboral-puerto-montt",
        nombre: "Derecho Laboral",
        titulo: "Abogado Laboral en Puerto Montt | Defensa Jurídica Sur",
        descripcion:
            "Abogados laborales en Puerto Montt para despidos, autodespido, tutela, finiquitos y comparendos. Revisión de antecedentes y plazos legales.",
        encabezado: "Abogado laboral en Puerto Montt",
        introduccion:
            "En los conflictos laborales existen plazos breves que pueden cambiar las opciones disponibles. Revisamos contratos, anexos, liquidaciones, comunicaciones y causal de término para orientar una respuesta oportuna y fundada.",
        situaciones: [
            "Despido injustificado, indebido o improcedente",
            "Autodespido y cobro de prestaciones",
            "Tutela por vulneración de derechos fundamentales",
            "Revisión de finiquitos y remuneraciones pendientes",
            "Accidentes del trabajo y licencias médicas",
            "Comparendos ante la Inspección del Trabajo",
        ],
        enfoque:
            "Determinamos los plazos vigentes, ordenamos la documentación y estimamos las acciones posibles antes de presentar una denuncia o demanda. La evaluación considera tanto la prueba disponible como los costos y tiempos del procedimiento.",
        preguntas: [
            {
                pregunta: "¿Cuánto tiempo tengo para reclamar por un despido?",
                respuesta:
                    "Los plazos laborales suelen ser breves y pueden suspenderse por gestiones ante la Inspección del Trabajo. Conviene revisar el caso inmediatamente después del despido.",
            },
            {
                pregunta: "¿Debo firmar el finiquito si no estoy de acuerdo?",
                respuesta:
                    "Es posible formular una reserva de derechos cuando corresponde. Antes de firmar, recomendamos revisar el texto, los montos y la causal de término.",
            },
        ],
    },
    {
        slug: "abogado-civil-puerto-montt",
        nombre: "Derecho Civil",
        titulo: "Abogado Civil en Puerto Montt | Defensa Jurídica Sur",
        descripcion:
            "Abogados civiles en Puerto Montt para contratos, arriendos, cobranzas, herencias, indemnizaciones y prescripción de deudas.",
        encabezado: "Abogado civil en Puerto Montt",
        introduccion:
            "Los asuntos civiles abarcan desde obligaciones contractuales hasta conflictos sobre bienes y herencias. Analizamos documentos, fechas y actuaciones previas para definir una vía de negociación, regularización o litigación.",
        situaciones: [
            "Juicios ejecutivos y cobranzas",
            "Contratos y conflictos de arrendamiento",
            "Indemnización de perjuicios",
            "Precario, reivindicación y conflictos sobre inmuebles",
            "Partición y tramitación de herencias",
            "Prescripción de deudas y obligaciones",
        ],
        enfoque:
            "Partimos por identificar el documento o hecho que origina el conflicto y los plazos aplicables. Luego explicamos las alternativas, la prueba necesaria y los efectos previsibles de una negociación o acción judicial.",
        preguntas: [
            {
                pregunta: "¿Qué debo llevar a una consulta civil?",
                respuesta:
                    "Contratos, escrituras, comprobantes de pago, cartas, correos, resoluciones y una cronología de los hechos ayudan a realizar una evaluación inicial más precisa.",
            },
            {
                pregunta: "¿Todos los conflictos civiles requieren juicio?",
                respuesta:
                    "No. Según los antecedentes puede ser preferible negociar, formalizar un acuerdo o realizar una gestión previa. Si no existe solución, se evalúa la acción judicial adecuada.",
            },
        ],
    },
    {
        slug: "abogado-administrativo-puerto-montt",
        nombre: "Derecho Administrativo",
        titulo: "Abogado Administrativo en Puerto Montt | Defensa Jurídica Sur",
        descripcion:
            "Defensa en sumarios, investigaciones y procedimientos administrativos para funcionarios públicos en Puerto Montt y la Región de Los Lagos.",
        encabezado: "Abogado administrativo en Puerto Montt",
        introduccion:
            "Los procedimientos administrativos exigen responder dentro de plazo y con conocimiento de las reglas que rigen a los órganos públicos. Asesoramos a funcionarios y particulares frente a investigaciones, sanciones y decisiones administrativas.",
        situaciones: [
            "Sumarios e investigaciones administrativas",
            "Formulación de descargos y presentación de prueba",
            "Responsabilidad de funcionarios públicos",
            "Recursos administrativos y solicitudes de invalidación",
            "Presentaciones ante la Contraloría",
            "Impugnación de actos y sanciones administrativas",
        ],
        enfoque:
            "Ordenamos el expediente, verificamos competencia, notificaciones y plazos, y preparamos una respuesta fundada en los hechos y la normativa aplicable. Cada actuación se define según la etapa exacta del procedimiento.",
        preguntas: [
            {
                pregunta: "¿Puedo defenderme durante un sumario administrativo?",
                respuesta:
                    "Sí. El procedimiento contempla oportunidades para conocer cargos, presentar descargos, aportar prueba y recurrir, según el estatuto y la etapa en que se encuentre.",
            },
            {
                pregunta: "¿Atienden a funcionarios fuera de Puerto Montt?",
                respuesta:
                    "Sí. Podemos evaluar expedientes de otras comunas y coordinar reuniones online, sin perjuicio de las actuaciones presenciales que cada caso requiera.",
            },
        ],
    },
    {
        slug: "abogado-justicia-militar-chile",
        nombre: "Justicia Militar",
        titulo: "Abogado en Justicia Militar | Defensa Jurídica Sur",
        descripcion:
            "Asesoría y defensa en procesos disciplinarios y causas de justicia militar para integrantes de Fuerzas Armadas y de Orden en Chile.",
        encabezado: "Abogado en justicia militar",
        introduccion:
            "Las causas militares y disciplinarias combinan normas especiales, jerarquía institucional y consecuencias profesionales relevantes. Prestamos orientación confidencial para comprender cargos, plazos, recursos y tribunales competentes.",
        situaciones: [
            "Desacato, desobediencia y abandono de deberes",
            "Procesos y sanciones disciplinarias",
            "Investigaciones y actuaciones institucionales",
            "Recursos ante la Corte Marcial",
            "Tramitación ante juzgados militares, navales y de aviación",
            "Procedimientos vinculados a Carabineros y Fuerzas Armadas",
        ],
        enfoque:
            "Revisamos la resolución, el expediente disponible y la normativa especial aplicable. A partir de ello definimos descargos, prueba y recursos, resguardando la confidencialidad y los plazos del procedimiento.",
        preguntas: [
            {
                pregunta: "¿La justicia militar se aplica a todos los funcionarios?",
                respuesta:
                    "Depende de la institución, de la conducta investigada y de la normativa vigente. Es necesario revisar el caso concreto para determinar la competencia y el procedimiento.",
            },
            {
                pregunta: "¿Pueden revisar un proceso disciplinario en curso?",
                respuesta:
                    "Sí. Para una evaluación inicial se requiere la resolución que ordena el procedimiento, las notificaciones, los cargos y las actuaciones disponibles.",
            },
        ],
    },
];

export const servicioPorSlug = new Map(serviciosSeo.map((servicio) => [servicio.slug, servicio]));
