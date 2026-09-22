export const demoCategories = [
  { slug: 'derecho-laboral', name: 'Laboral', description: 'Trabajo, remuneraciones y finiquitos.' },
  { slug: 'derecho-familia', name: 'Familia', description: 'Alimentos, cuidados y relaciones familiares.' },
  { slug: 'derecho-penal', name: 'Penal', description: 'Denuncias, citaciones y defensa.' },
  { slug: 'derecho-civil', name: 'Civil', description: 'Arriendos, contratos y patrimonio.' },
  { slug: 'otras-consultas', name: 'Otras', description: 'Orientación para identificar el área de consulta.' },
];
export type DemoStatus = 'pendiente' | 'publicada' | 'rechazada';
export interface DemoQuestion { id: string; category: string; title: string; detail: string; alias: string; status: DemoStatus; answer: string; date: string }
const examples = [
  ['derecho-laboral', 'Diferencias en el cálculo de mi finiquito', 'Caso ficticio: trabajé dos años en una empresa de servicios de Puerto Montt. El monto del borrador de finiquito no coincide con mis liquidaciones. Quisiera mostrar los antecedentes al equipo antes de decidir qué hacer.'],
  ['derecho-familia', 'Cambio de gastos en un acuerdo familiar', 'Caso ficticio: mi hija comenzó un nuevo año escolar y cambiaron sus gastos de transporte. Existe un acuerdo anterior entre sus padres. Quiero saber cómo presentar los antecedentes para que un abogado revise la situación.'],
  ['derecho-penal', 'Recibí una citación y necesito comprenderla', 'Caso ficticio: recibí una citación relacionada con un incidente ocurrido en un comercio. No tengo claro en qué calidad debo concurrir. Quisiera coordinar una revisión privada del documento.'],
  ['derecho-civil', 'Devolución de garantía de un arriendo', 'Caso ficticio: entregué un departamento arrendado y tenemos diferencias sobre la devolución de la garantía. Conservo el contrato, fotografías y el acta de entrega. Me gustaría ordenar esos antecedentes para una consulta.'],
  ['otras-consultas', '¿En qué área debo ingresar mi consulta?', 'Caso ficticio: tengo un desacuerdo por un servicio contratado para mi emprendimiento y no sé qué especialidad corresponde. Busco una primera revisión para clasificar mi consulta.'],
  ['derecho-laboral', 'Consulta pendiente sobre turnos de trabajo', 'Caso ficticio: cambiaron los turnos de una trabajadora de una empresa inventada. Quiere mostrar su contrato y el calendario anterior para que el equipo pueda revisar su pregunta.'],
  ['derecho-civil', 'Ejemplo de consulta descartada por ser una prueba', 'Caso ficticio: este registro se creó únicamente para mostrar la sección de rechazadas. No corresponde a ninguna persona ni controversia real.'],
];
export const demoQuestions: DemoQuestion[] = examples.map(([category, title, detail], index) => ({
  id: `ejemplo-${index + 1}`, category, title, detail, alias: `Persona ficticia ${index + 1}`,
  status: index === 5 ? 'pendiente' : index === 6 ? 'rechazada' : 'publicada',
  answer: index < 4 ? 'Respuesta de demostración, no emitida por un abogado: hemos recibido este ejemplo. En una atención real, el equipo revisaría los antecedentes de manera privada antes de entregar una orientación específica. No compartas documentos ni datos personales en este foro de prueba.' : '',
  date: `2026-09-${String(21 - index).padStart(2, '0')}T12:00:00Z`,
}));
