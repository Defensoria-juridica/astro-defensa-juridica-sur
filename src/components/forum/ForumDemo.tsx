import { useEffect, useState } from 'react';
import { demoCategories, demoQuestions, type DemoQuestion, type DemoStatus } from '../../data/forum-demo';
import './forum-demo.css';

const KEY = 'djs-forum-demo-v1';
const href = (q: DemoQuestion) => `/consultas-juridicas/${q.category}/${q.id}`;
const valid = (q: DemoQuestion) => q && typeof q.id === 'string' && /^[a-z0-9-]{1,80}$/.test(q.id) && demoCategories.some(c => c.slug === q.category) && ['pendiente', 'publicada', 'rechazada'].includes(q.status) && ['title', 'detail', 'alias', 'answer', 'date'].every(k => typeof q[k as keyof DemoQuestion] === 'string') && q.title.length <= 180 && q.detail.length <= 5000 && q.answer.length <= 10000 && Number.isFinite(Date.parse(q.date));

export default function ForumDemo({ path }: { path: string }) {
  const [questions, setQuestions] = useState<DemoQuestion[]>(demoQuestions);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<DemoStatus>('pendiente');
  const [search, setSearch] = useState('');
  const [resetAsked, setResetAsked] = useState(false);
  const parts = path.split('/').filter(Boolean);
  const admin = parts[0] === 'admin';
  const category = demoCategories.find(c => c.slug === parts[1]);
  const id = parts[2];
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          if (!Array.isArray(saved) || saved.length > 100 || !saved.every(valid)) throw new Error();
          setQuestions(saved);
        } else setQuestions(demoQuestions);
      } catch { setMessage('No se pudieron leer los cambios locales. Se muestran los ejemplos originales. Puedes restablecer la demo.'); }
      setReady(true);
    };
    read();
    const sync = (e: StorageEvent) => { if (e.key === KEY) read(); };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  function save(next: DemoQuestion[], text: string) {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setQuestions(next); setMessage(text); return true;
    } catch { setMessage('No se pudo guardar: habilita el almacenamiento del navegador o libera espacio. La operación no se realizó.'); return false; }
  }
  function moderate(q: DemoQuestion, status: DemoStatus, answer = q.answer) {
    save(questions.map(item => item.id === q.id ? { ...item, status, answer } : item), 'Cambio guardado solo en esta demostración.');
  }
  const selected = questions.find(q => q.id === id && q.category === category?.slug && q.status === 'publicada');
  const visible = questions.filter(q => q.status === (admin ? filter : 'publicada') && (admin || !category || q.category === category.slug) && `${q.title} ${q.detail}`.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es'))).sort((a, b) => b.date.localeCompare(a.date));
  return <main className="forum-demo">
    <div className="fd-shell">
      <aside className="fd-notice"><strong>DEMOSTRACIÓN · Todos los casos son ficticios</strong><p>No es un canal de atención. Usa solo información inventada. Los envíos y las respuestas se guardan en este navegador; no se envían al estudio ni a la base de datos real.</p></aside>
      <nav className="fd-nav" aria-label="Navegación del foro"><a href="/">Inicio del sitio</a><a href="/consultas-juridicas">Foro público</a><a href="/admin/demo">Administrar demo</a></nav>
      <header className="fd-hero"><span>DEFENSA JURÍDICA SUR / FORO</span><h1>{admin ? 'Administración de demostración' : id ? 'Detalle de consulta' : category ? `Consultas de ${category.name}` : 'Un espacio para tus consultas jurídicas'}</h1><p>{admin ? 'Revisa, publica, rechaza y responde consultas ficticias. Este panel de prueba no concede acceso a la administración real.' : 'Explora cómo será el foro: elige un área, lee un ejemplo o prueba el envío de una consulta ficticia.'}</p><a className="fd-button" href={admin ? '/consultas-juridicas' : '/consultas-juridicas#formulario-consulta'}>{admin ? 'Ver foro público' : 'Crear consulta de prueba'}</a></header>
      <p className="fd-status" role="status" aria-live="polite">{message || (!ready ? 'Cargando demostración…' : 'Demo lista. Los cambios se conservan al navegar en este navegador.')} {!ready && <span>Espera antes de enviar.</span>}</p>
      {admin ? <>
        <div className="fd-toolbar"><div className="fd-tabs" aria-label="Filtrar por estado">{(['pendiente','publicada','rechazada'] as DemoStatus[]).map(s => <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)}>{s === 'pendiente' ? 'Pendientes' : s === 'publicada' ? 'Publicadas' : 'Rechazadas'} ({questions.filter(q => q.status === s).length})</button>)}</div><button disabled={!ready} onClick={() => setResetAsked(true)}>Restablecer ejemplos</button></div>
        {resetAsked && <div className="fd-notice"><p>Se borrarán únicamente las consultas y respuestas de prueba guardadas en este navegador.</p><button onClick={() => { if(save(demoQuestions, 'Ejemplos originales restablecidos.')) setResetAsked(false); }}>Sí, restablecer demo</button> <button onClick={() => setResetAsked(false)}>Cancelar</button></div>}
      </> : !id && <section aria-label="Categorías"><h2>Categorías de consulta</h2><div className="fd-categories">{demoCategories.map(c => <a key={c.slug} href={`/consultas-juridicas/${c.slug}`} aria-current={category?.slug === c.slug ? 'page' : undefined}><h3>{c.name}</h3><p>{c.description}</p><span>Ver consultas →</span></a>)}</div></section>}
      {id ? <section>{!ready ? <p>Cargando consulta…</p> : selected ? <article className="fd-card"><span className="fd-badge">Caso ficticio · {category?.name}</span><h2>{selected.title}</h2><p className="fd-detail">{selected.detail}</p><p className="fd-meta">{selected.alias} · {new Date(selected.date).toLocaleDateString('es-CL')}</p><div className="fd-answer"><h3>{selected.answer ? 'Respuesta de demostración' : 'Aún sin respuesta'}</h3><p className="fd-detail">{selected.answer || 'Este ejemplo está publicado y pendiente de una respuesta del equipo de demostración.'}</p></div><a href={`/consultas-juridicas/${category?.slug}`}>← Volver a {category?.name}</a></article> : <div className="fd-card"><h2>Consulta no disponible</h2><p>No existe una consulta publicada con este enlace en este navegador. Puede estar pendiente o rechazada.</p><a href="/consultas-juridicas">Volver al foro</a></div>}</section> : <section id="consultas-recientes"><h2>{admin ? 'Gestionar consultas ficticias' : category ? `Preguntas de ${category.name}` : 'Consultas recientes'}</h2><label className="fd-search">Buscar consultas<input type="search" maxLength={180} value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por título o detalle" /></label><div className={admin ? 'fd-admin-list' : 'fd-grid'}>{visible.map(q => <article className="fd-card" key={q.id}><span className="fd-badge">Ficticio · {demoCategories.find(c => c.slug === q.category)?.name}</span><h3>{admin ? q.title : <a href={href(q)}>{q.title}</a>}</h3><p className="fd-detail">{admin ? q.detail : q.detail.slice(0,145) + '…'}</p><p className="fd-meta">{q.alias} · {new Date(q.date).toLocaleDateString('es-CL')}</p>{admin ? <><p><strong>Estado:</strong> {q.status}</p>{q.answer && <div className="fd-answer"><strong>Respuesta guardada</strong><p className="fd-detail">{q.answer}</p></div>}<div className="fd-actions">{q.status !== 'publicada' && <button disabled={!ready} onClick={() => moderate(q,'publicada')}>Aprobar y publicar</button>}{q.status !== 'rechazada' && <button disabled={!ready} onClick={() => moderate(q,'rechazada')}>Rechazar</button>}{q.status !== 'pendiente' && <button disabled={!ready} onClick={() => moderate(q,'pendiente')}>Volver a pendientes</button>}{q.status === 'publicada' && <a href={href(q)}>Ver publicación →</a>}</div><form onSubmit={e => { e.preventDefault(); const form = e.currentTarget; const answer = String(new FormData(form).get('answer') ?? '').trim(); if (answer.length < 20 || answer.length > 10000) { setMessage('La respuesta debe tener entre 20 y 10.000 caracteres.'); return; } moderate(q,'publicada',answer); }}><label>Respuesta ficticia<textarea name="answer" defaultValue={q.answer} required minLength={20} maxLength={10000} rows={4} /></label><button className="fd-button" disabled={!ready}>Guardar respuesta y publicar</button></form></> : <a className="fd-read" href={href(q)}>{q.answer ? 'Leer consulta y respuesta' : 'Leer consulta · sin respuesta'} →</a>}</article>)}</div>{visible.length === 0 && <p className="fd-card">No hay consultas que coincidan con esta selección.</p>}</section>}
      {!admin && !id && <section id="formulario-consulta" className="fd-form-section"><h2>Enviar consulta ficticia</h2><p>Esta prueba no solicita correo, teléfono ni documentos. No uses nombres reales.</p><form onSubmit={e => { e.preventDefault(); const form = e.currentTarget; const data = new FormData(form); const title = String(data.get('title') ?? '').trim(), detail = String(data.get('detail') ?? '').trim(), alias = String(data.get('alias') ?? '').trim(), category = String(data.get('category') ?? ''); if (title.length < 8 || detail.length < 20 || alias.length < 2 || !demoCategories.some(c => c.slug === category) || !data.has('consent')) { setMessage('Revisa el título, el detalle, la categoría y la confirmación de datos ficticios.'); return; } if (questions.length >= 100) { setMessage('Se alcanzó el límite de 100 ejemplos. Restablece la demo para continuar.'); return; } const q: DemoQuestion = {id: crypto.randomUUID(), category, title, detail, alias, status:'pendiente', answer:'', date:new Date().toISOString()}; if(save([q,...questions], 'Consulta ficticia guardada como pendiente. Abre Administrar demo para revisarla.')) form.reset(); }}>
        <label>Alias ficticio<input name="alias" required minLength={2} maxLength={80} placeholder="Ejemplo: Persona de prueba" /></label>
        <label>Categoría<select name="category" required defaultValue={category?.slug ?? ''}><option value="">Selecciona un área</option>{demoCategories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
        <label>Título de la consulta<input name="title" required minLength={8} maxLength={180} /></label><label>Detalle ficticio<textarea name="detail" required minLength={20} maxLength={5000} rows={5} /></label><label className="fd-check"><input type="checkbox" name="consent" required /> Confirmo que solo ingresé información inventada y entiendo que no se enviará una consulta real.</label><button disabled={!ready} className="fd-button">Enviar consulta de prueba</button><p role="status">{message}</p><a href="/admin/demo">Revisar consultas en el panel demo →</a>
      </form></section>}
      <footer className="fd-footer">Demostración para abogados · Sin atención ni asesoría jurídica real. <a href="/admin/login">Acceso administrativo real</a></footer>
    </div>
  </main>;
}
