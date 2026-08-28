from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


BASE = Path(__file__).resolve().parents[2]
SALIDA = BASE / "foro de defensa juridica" / "Guia-del-foro-Defensa-Juridica-Sur.pdf"

DORADO = colors.HexColor("#C18F59")
NEGRO = colors.HexColor("#212529")
GRIS = colors.HexColor("#667085")
GRIS_CLARO = colors.HexColor("#F5F6F7")
VERDE = colors.HexColor("#15803D")

estilos_base = getSampleStyleSheet()
estilos = {
    "portada": ParagraphStyle(
        "Portada",
        parent=estilos_base["Title"],
        fontName="Helvetica-Bold",
        fontSize=30,
        leading=36,
        alignment=TA_CENTER,
        textColor=NEGRO,
        spaceAfter=12,
    ),
    "subportada": ParagraphStyle(
        "Subportada",
        parent=estilos_base["Normal"],
        fontName="Helvetica",
        fontSize=14,
        leading=21,
        alignment=TA_CENTER,
        textColor=GRIS,
    ),
    "h1": ParagraphStyle(
        "H1",
        parent=estilos_base["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=21,
        leading=26,
        textColor=NEGRO,
        spaceBefore=4,
        spaceAfter=14,
    ),
    "h2": ParagraphStyle(
        "H2",
        parent=estilos_base["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=DORADO,
        spaceBefore=10,
        spaceAfter=7,
    ),
    "texto": ParagraphStyle(
        "Texto",
        parent=estilos_base["BodyText"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=16,
        textColor=NEGRO,
        spaceAfter=7,
    ),
    "bullet": ParagraphStyle(
        "Bullet",
        parent=estilos_base["BodyText"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=16,
        leftIndent=15,
        firstLineIndent=-9,
        textColor=NEGRO,
        spaceAfter=5,
    ),
    "paso": ParagraphStyle(
        "Paso",
        parent=estilos_base["BodyText"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=16,
        leftIndent=21,
        firstLineIndent=-18,
        textColor=NEGRO,
        spaceAfter=8,
    ),
    "caja": ParagraphStyle(
        "Caja",
        parent=estilos_base["BodyText"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=16,
        textColor=NEGRO,
        borderColor=DORADO,
        borderWidth=1,
        borderPadding=12,
        backColor=colors.HexColor("#FBF7F2"),
        spaceBefore=8,
        spaceAfter=12,
    ),
    "pequeno": ParagraphStyle(
        "Pequeno",
        parent=estilos_base["BodyText"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=GRIS,
    ),
}


def encabezado_pie(canvas, doc):
    canvas.saveState()
    ancho, alto = A4
    if doc.page > 1:
        canvas.setStrokeColor(DORADO)
        canvas.setLineWidth(1)
        canvas.line(20 * mm, alto - 16 * mm, ancho - 20 * mm, alto - 16 * mm)
        canvas.setFont("Helvetica-Bold", 8)
        canvas.setFillColor(NEGRO)
        canvas.drawString(20 * mm, alto - 12 * mm, "DEFENSA JURIDICA SUR")
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(GRIS)
    canvas.drawString(20 * mm, 12 * mm, "Guia del Centro de Consultas Juridicas")
    canvas.drawRightString(ancho - 20 * mm, 12 * mm, f"Pagina {doc.page}")
    canvas.restoreState()


def bullet(texto):
    return Paragraph(f"- {texto}", estilos["bullet"])


def paso(numero, texto):
    return Paragraph(f"<b>{numero}.</b> {texto}", estilos["paso"])


def tarjeta(titulo, contenido, color=DORADO):
    tabla = Table(
        [[Paragraph(titulo, estilos["h2"])], [Paragraph(contenido, estilos["texto"])]],
        colWidths=[165 * mm],
    )
    tabla.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), GRIS_CLARO),
                ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#E2E4E7")),
                ("LINEBEFORE", (0, 0), (0, -1), 4, color),
                ("LEFTPADDING", (0, 0), (-1, -1), 14),
                ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return tabla


historia = []

# Portada
historia.extend(
    [
        Spacer(1, 36 * mm),
        Paragraph("DEFENSA JURIDICA SUR", estilos["subportada"]),
        Spacer(1, 8 * mm),
        Paragraph("Guia del Centro de<br/>Consultas Juridicas", estilos["portada"]),
        Spacer(1, 6 * mm),
        Table([[""]], colWidths=[55 * mm], rowHeights=[2.5 * mm], style=[("BACKGROUND", (0, 0), (-1, -1), DORADO)]),
        Spacer(1, 12 * mm),
        Paragraph(
            "Resumen de funcionamiento para aprender a utilizar el foro como usuario y como administrador.",
            estilos["subportada"],
        ),
        Spacer(1, 30 * mm),
        tarjeta(
            "Objetivo de esta guia",
            "Comprender el recorrido completo de una consulta: desde su envio en el sitio publico, pasando por la revision privada, hasta su respuesta y publicacion en el foro.",
        ),
        Spacer(1, 18 * mm),
        Paragraph("Preparado el 19 de agosto de 2026", estilos["subportada"]),
        PageBreak(),
    ]
)

# Panorama general
historia.extend(
    [
        Paragraph("1. Que construimos", estilos["h1"]),
        Paragraph(
            "El foro ya cuenta con una pagina publica, una base de datos real y un panel administrativo privado. Cada consulta sigue un flujo de moderacion antes de aparecer en internet.",
            estilos["texto"],
        ),
        Spacer(1, 3 * mm),
        tarjeta(
            "Sitio publico",
            "Los visitantes pueden elegir una categoria, escribir su consulta y enviarla. El formulario solicita datos de contacto para que el equipo pueda comunicarse con la persona.",
        ),
        Spacer(1, 2 * mm),
        tarjeta(
            "Base de datos Supabase",
            "Almacena categorias, consultas y respuestas. Las consultas nuevas ingresan con estado <b>pendiente</b> y no se publican automaticamente.",
        ),
        Spacer(1, 2 * mm),
        tarjeta(
            "Panel administrativo",
            "Permite revisar los datos completos, aprobar, rechazar o responder. Solo se accede mediante la contrasena administrativa configurada en el servidor.",
            VERDE,
        ),
        Paragraph("Estados de una consulta", estilos["h2"]),
        bullet("<b>Pendiente:</b> fue recibida y espera revision."),
        bullet("<b>Publicada:</b> fue aprobada y puede aparecer en el foro."),
        bullet("<b>Rechazada:</b> fue descartada y no se muestra publicamente."),
        Spacer(1, 2 * mm),
        Paragraph(
            "Regla de privacidad: el nombre, correo y WhatsApp se muestran solamente en el panel privado. El foro publico presenta el titulo, el detalle, la categoria y las respuestas profesionales.",
            estilos["caja"],
        ),
        PageBreak(),
    ]
)

# Usuario
historia.extend(
    [
        Paragraph("2. Uso del foro como usuario", estilos["h1"]),
        Paragraph("Direccion local de prueba: <b>http://127.0.0.1:4321/consultas-juridicas</b>", estilos["texto"]),
        Paragraph("Como enviar una consulta", estilos["h2"]),
        paso(1, "Abrir el Centro de Consultas Juridicas."),
        paso(2, "Revisar las categorias disponibles y seleccionar el area relacionada con la pregunta."),
        paso(3, "Completar nombre, correo electronico y WhatsApp."),
        paso(4, "Escribir un titulo claro y explicar el caso con suficiente detalle."),
        paso(5, "Aceptar que la orientacion es informativa y no reemplaza una asesoria personalizada."),
        paso(6, "Presionar <b>Enviar consulta</b> y esperar el mensaje verde de confirmacion."),
        Paragraph("Que ocurre despues", estilos["h2"]),
        bullet("La consulta se guarda inmediatamente en Supabase."),
        bullet("Su estado inicial es <b>pendiente</b>."),
        bullet("El equipo juridico revisa el contenido desde el panel privado."),
        bullet("Si se aprueba, puede aparecer en la seccion de consultas recientes."),
        bullet("Si recibe una respuesta publica, esa orientacion se muestra junto a la consulta."),
        Paragraph("Buenas practicas para el usuario", estilos["h2"]),
        bullet("Usar un titulo concreto, por ejemplo: Pago de horas extras en fin de semana."),
        bullet("No publicar claves, datos bancarios ni informacion innecesariamente sensible."),
        bullet("Recordar que el formulario entrega orientacion general, no una defensa judicial automatica."),
        Paragraph(
            "Confirmacion esperada: Consulta enviada. Nuestro equipo la revisara antes de publicarla.",
            estilos["caja"],
        ),
        PageBreak(),
    ]
)

# Admin y seguridad
historia.extend(
    [
        Paragraph("3. Uso del foro como administrador", estilos["h1"]),
        Paragraph("Direccion local: <b>http://127.0.0.1:4321/admin/login</b>", estilos["texto"]),
        Paragraph("Ingreso y revision", estilos["h2"]),
        paso(1, "Abrir el panel e ingresar la contrasena definida en <b>ADMIN_PASSWORD</b>."),
        paso(2, "Entrar a <b>Pendientes</b> y leer el titulo, el detalle y los datos de contacto."),
        paso(3, "Elegir la accion adecuada despues de revisar el contenido."),
        Spacer(1, 3 * mm),
        tarjeta("Aprobar y publicar", "Mueve la consulta a Publicadas. Puede utilizarse cuando el contenido es apropiado aunque todavia no exista una respuesta."),
        Spacer(1, 3 * mm),
        tarjeta("Rechazar", "Mueve la consulta a Rechazadas y evita que aparezca en el foro publico.", colors.HexColor("#B91C1C")),
        Spacer(1, 3 * mm),
        tarjeta("Guardar respuesta y publicar", "Guarda la orientacion profesional y publica la consulta en una sola accion.", VERDE),
        Paragraph("Seguridad esencial", estilos["h2"]),
        bullet("Cerrar la sesion al terminar de administrar el foro."),
        bullet("No compartir capturas que contengan correos, telefonos o nombres de usuarios."),
        bullet("Nunca publicar el archivo <b>.env</b> ni la clave <b>SUPABASE_SERVICE_ROLE_KEY</b>."),
        bullet("No enviar por chat la contrasena administrativa ni la clave secreta de Supabase."),
        PageBreak(),
        Paragraph("4. Referencia rapida y seguridad", estilos["h1"]),
        Paragraph(
            "Estas variables permiten que el servidor se conecte con Supabase y mantenga protegido el panel administrativo.",
            estilos["texto"],
        ),
        Paragraph("Variables privadas", estilos["h2"]),
    ]
)

datos = [
    [Paragraph("Variable", estilos["pequeno"]), Paragraph("Funcion", estilos["pequeno"])],
    [Paragraph("SUPABASE_URL", estilos["pequeno"]), Paragraph("Identifica el proyecto de base de datos.", estilos["pequeno"])],
    [Paragraph("SUPABASE_SERVICE_ROLE_KEY", estilos["pequeno"]), Paragraph("Autoriza las operaciones del servidor.", estilos["pequeno"])],
    [Paragraph("ADMIN_PASSWORD", estilos["pequeno"]), Paragraph("Protege el acceso al panel.", estilos["pequeno"])],
    [Paragraph("ADMIN_SESSION_SECRET", estilos["pequeno"]), Paragraph("Firma la sesion administrativa.", estilos["pequeno"])],
]

tabla_variables = Table(datos, colWidths=[62 * mm, 103 * mm], repeatRows=1)
tabla_variables.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), NEGRO),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("BACKGROUND", (0, 1), (-1, -1), GRIS_CLARO),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#D6D9DD")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ("RIGHTPADDING", (0, 0), (-1, -1), 8),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ]
    )
)
historia.extend(
    [
        tabla_variables,
        Spacer(1, 8 * mm),
        Paragraph(
            "Proximo aprendizaje recomendado: realizar una consulta de prueba, revisarla como administrador, escribir una respuesta y confirmar su aparicion en la pagina publica.",
            estilos["caja"],
        ),
    ]
)

documento = SimpleDocTemplate(
    str(SALIDA),
    pagesize=A4,
    rightMargin=20 * mm,
    leftMargin=20 * mm,
    topMargin=22 * mm,
    bottomMargin=20 * mm,
    title="Guia del Foro Defensa Juridica Sur",
    author="Defensa Juridica Sur",
    subject="Resumen de uso del foro juridico",
)
documento.build(historia, onFirstPage=encabezado_pie, onLaterPages=encabezado_pie)
print(SALIDA)
