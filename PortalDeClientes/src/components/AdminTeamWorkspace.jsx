import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Target, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  TrendingUp, 
  Sparkles, 
  Briefcase, 
  ShieldCheck, 
  Calendar,
  AlertCircle,
  ArrowRight,
  Share2,
  FileText,
  X
} from 'lucide-react';

const INITIAL_ADMINS = [
  {
    id: 'mario',
    name: 'Mario',
    role: 'Lead Full-Stack & Cloud Architecture',
    subRole: 'Co-Fundador TecnOdiel',
    avatar: 'MA',
    color: '#10b981', // emerald
    bgGradient: 'from-emerald-500/20 via-zinc-900 to-zinc-950',
    borderColor: 'border-emerald-500/40',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    totalHours: 48.5,
    hoursBreakdown: [
      { area: 'Multiwebs & 30 Plantillas', hours: 22.0 },
      { area: 'Portal Clientes & Aislamiento', hours: 14.5 },
      { area: 'Cloudflare Pages & Supabase', hours: 12.0 }
    ],
    doneTasks: [
      {
        id: 'm-d1',
        title: 'Desarrollo del motor de 30 plantillas dinámicas y selector de estilos únicos',
        hours: 14.0,
        date: 'Reciente',
        category: 'Desarrollo'
      },
      {
        id: 'm-d2',
        title: 'Automatización del despliegue a Cloudflare Pages (*.pages.dev) sin coste',
        hours: 8.5,
        date: 'Reciente',
        category: 'Infraestructura'
      },
      {
        id: 'm-d3',
        title: 'Aislamiento de clientes con claves únicas (TO-XXXX) y políticas RLS Supabase',
        hours: 9.0,
        date: 'Reciente',
        category: 'Ciberseguridad'
      },
      {
        id: 'm-d4',
        title: 'Panel Maestro de Monitorización con KPIs, checklists de tareas y notas',
        hours: 11.0,
        date: 'Esta semana',
        category: 'Gestión'
      },
      {
        id: 'm-d5',
        title: 'Auditoría de ciberseguridad OWASP y cabeceras HSTS/CSP en vercel.json',
        hours: 6.0,
        date: 'Esta semana',
        category: 'Ciberseguridad'
      }
    ],
    todoTasks: [
      {
        id: 'm-t1',
        title: 'Sincronización automática de dominios personalizados (.es / .com) vía API Cloudflare',
        priority: 'Alta',
        category: 'Infraestructura'
      },
      {
        id: 'm-t2',
        title: 'Webhooks para alertas directas a Telegram/WhatsApp al cambiar cartas o recibir reservas',
        priority: 'Media',
        category: 'Automatización'
      },
      {
        id: 'm-t3',
        title: 'Integración de pasarela Stripe para automatizar el cobro recurrente de cuotas',
        priority: 'Alta',
        category: 'Finanzas'
      }
    ]
  },
  {
    id: 'javier',
    name: 'Javier',
    role: 'Dirección de Operaciones & Ciberseguridad',
    subRole: 'Co-Fundador TecnOdiel',
    avatar: 'JA',
    color: '#06b6d4', // cyan
    bgGradient: 'from-cyan-500/20 via-zinc-900 to-zinc-950',
    borderColor: 'border-cyan-500/40',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    totalHours: 42.0,
    hoursBreakdown: [
      { area: 'Ciberseguridad & Legal', hours: 16.5 },
      { area: 'Estructuración Comercial', hours: 14.0 },
      { area: 'Red Cloudflare & DNS', hours: 11.5 }
    ],
    doneTasks: [
      {
        id: 'j-d1',
        title: 'Auditoría técnica de seguridad y hardening de políticas Row Level Security (RLS)',
        hours: 10.0,
        date: 'Reciente',
        category: 'Ciberseguridad'
      },
      {
        id: 'j-d2',
        title: 'Estructuración de planes comerciales hostelería (99€/mes) y rentabilidad neta',
        hours: 7.5,
        date: 'Reciente',
        category: 'Estrategia'
      },
      {
        id: 'j-d3',
        title: 'Configuración de reglas de caché Cloudflare CDN, firewall WAF y protección anti-DDoS',
        hours: 8.5,
        date: 'Esta semana',
        category: 'Sistemas'
      },
      {
        id: 'j-d4',
        title: 'Protocolo de onboarding de clientes y verificación de reservas vía WhatsApp',
        hours: 9.0,
        date: 'Esta semana',
        category: 'Operaciones'
      },
      {
        id: 'j-d5',
        title: 'Revisión legal de cumplimiento RGPD, política de privacidad y términos de servicio',
        hours: 7.0,
        date: 'Esta semana',
        category: 'Legal'
      }
    ],
    todoTasks: [
      {
        id: 'j-t1',
        title: 'Automatizar firma digital de contratos mercantiles y mandato SEPA de domiciliación',
        priority: 'Alta',
        category: 'Legal'
      },
      {
        id: 'j-t2',
        title: 'Diseñar informe mensual de analítica web y tráfico para enviar por PDF a clientes',
        priority: 'Media',
        category: 'Reporting'
      },
      {
        id: 'j-t3',
        title: 'Establecer canal de WhatsApp Business oficial TecnOdiel con respuestas rápidas',
        priority: 'Alta',
        category: 'Atención'
      }
    ]
  }
];

export default function AdminTeamWorkspace() {
  const [admins, setAdmins] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tecnodiel_admin_team_data_v2');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Error reading saved admin team data:', e);
        }
      }
    }
    return INITIAL_ADMINS;
  });

  const [selectedAdminId, setSelectedAdminId] = useState('all'); // 'all' | 'mario' | 'javier'
  const [copiedReport, setCopiedReport] = useState(false);

  // Modal: Add Done Task
  const [isAddDoneModalOpen, setIsAddDoneModalOpen] = useState(false);
  const [targetAdminForDone, setTargetAdminForDone] = useState('mario');
  const [newDoneTitle, setNewDoneTitle] = useState('');
  const [newDoneHours, setNewDoneHours] = useState('2.0');
  const [newDoneCategory, setNewDoneCategory] = useState('Desarrollo');

  // Modal: Add Todo Task
  const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);
  const [targetAdminForTodo, setTargetAdminForTodo] = useState('mario');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState('Alta');
  const [newTodoCategory, setNewTodoCategory] = useState('Objetivo');

  // Save to localStorage whenever admins changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tecnodiel_admin_team_data_v2', JSON.stringify(admins));
    }
  }, [admins]);

  // Aggregate metrics
  const totalTeamHours = admins.reduce((sum, a) => sum + (parseFloat(a.totalHours) || 0), 0);
  const totalCompletedTasks = admins.reduce((sum, a) => sum + (a.doneTasks || []).length, 0);
  const totalPendingObjectives = admins.reduce((sum, a) => sum + (a.todoTasks || []).length, 0);

  // Handle adding done task
  const handleSaveDoneTask = (e) => {
    e.preventDefault();
    if (!newDoneTitle.trim()) return;

    const hoursNum = parseFloat(newDoneHours) || 1.0;
    const newTask = {
      id: `done-${Date.now()}`,
      title: newDoneTitle.trim(),
      hours: hoursNum,
      date: 'Hoy',
      category: newDoneCategory
    };

    setAdmins(prev => prev.map(a => {
      if (a.id === targetAdminForDone) {
        return {
          ...a,
          totalHours: Math.round(((parseFloat(a.totalHours) || 0) + hoursNum) * 10) / 10,
          doneTasks: [newTask, ...(a.doneTasks || [])]
        };
      }
      return a;
    }));

    setNewDoneTitle('');
    setNewDoneHours('2.0');
    setIsAddDoneModalOpen(false);
  };

  // Handle adding todo task
  const handleSaveTodoTask = (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    const newTask = {
      id: `todo-${Date.now()}`,
      title: newTodoTitle.trim(),
      priority: newTodoPriority,
      category: newTodoCategory
    };

    setAdmins(prev => prev.map(a => {
      if (a.id === targetAdminForTodo) {
        return {
          ...a,
          todoTasks: [...(a.todoTasks || []), newTask]
        };
      }
      return a;
    }));

    setNewTodoTitle('');
    setIsAddTodoModalOpen(false);
  };

  // Handle converting a todo task into a completed task
  const handleCompleteTodoTask = (adminId, taskId) => {
    const hoursPrompt = window.prompt('¿Cuántas horas has invertido en completar esta tarea?', '2.0');
    if (hoursPrompt === null) return;
    const hoursNum = parseFloat(hoursPrompt) || 1.0;

    setAdmins(prev => prev.map(a => {
      if (a.id === adminId) {
        const targetTodo = (a.todoTasks || []).find(t => t.id === taskId);
        if (!targetTodo) return a;

        const newDone = {
          id: `done-from-todo-${Date.now()}`,
          title: targetTodo.title,
          hours: hoursNum,
          date: 'Hoy',
          category: targetTodo.category || 'Objetivo completado'
        };

        return {
          ...a,
          totalHours: Math.round(((parseFloat(a.totalHours) || 0) + hoursNum) * 10) / 10,
          todoTasks: (a.todoTasks || []).filter(t => t.id !== taskId),
          doneTasks: [newDone, ...(a.doneTasks || [])]
        };
      }
      return a;
    }));
  };

  // Delete done task
  const handleDeleteDoneTask = (adminId, taskId) => {
    if (window.confirm('¿Eliminar este registro de trabajo?')) {
      setAdmins(prev => prev.map(a => {
        if (a.id === adminId) {
          const taskToDelete = (a.doneTasks || []).find(t => t.id === taskId);
          const deductHours = taskToDelete ? parseFloat(taskToDelete.hours) || 0 : 0;
          return {
            ...a,
            totalHours: Math.max(0, Math.round(((parseFloat(a.totalHours) || 0) - deductHours) * 10) / 10),
            doneTasks: (a.doneTasks || []).filter(t => t.id !== taskId)
          };
        }
        return a;
      }));
    }
  };

  // Delete todo task
  const handleDeleteTodoTask = (adminId, taskId) => {
    setAdmins(prev => prev.map(a => {
      if (a.id === adminId) {
        return {
          ...a,
          todoTasks: (a.todoTasks || []).filter(t => t.id !== taskId)
        };
      }
      return a;
    }));
  };

  // Copy team report for WhatsApp or meeting
  const handleCopyReport = () => {
    let report = `[REPORTE DE EQUIPO TECNODIEL - MARIO & JAVIER]\n`;
    report += `Total Horas Invertidas: ${totalTeamHours.toFixed(1)}h | Tareas Hechas: ${totalCompletedTasks} | Objetivos: ${totalPendingObjectives}\n\n`;

    admins.forEach(a => {
      report += `* ${a.name.toUpperCase()} - ${a.totalHours}h totales\n`;
      report += `[TRABAJO REALIZADO]:\n`;
      (a.doneTasks || []).slice(0, 4).forEach(t => {
        report += `  - ${t.title} (${t.hours}h)\n`;
      });
      report += `[PROXIMOS OBJETIVOS]:\n`;
      (a.todoTasks || []).slice(0, 3).forEach(t => {
        report += `  -> [${t.priority}] ${t.title}\n`;
      });
      report += `\n`;
    });

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const displayedAdmins = selectedAdminId === 'all' 
    ? admins 
    : admins.filter(a => a.id === selectedAdminId);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner (Matching Multitenant Aesthetics) */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950/60 via-zinc-950 to-zinc-950 border border-emerald-500/20 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TECNODIEL CORE — WORKSPACE DE EQUIPO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Gestión de Equipo & Dedicación
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              Seguimiento de horas reales de Mario y Javier. Control de hitos completados, auditoría de tareas y backlog de objetivos para la plataforma TecnOdiel.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setIsAddDoneModalOpen(true)}
              className="btn-industrial px-5 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs transition flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Registrar Horas / Hecho</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddTodoModalOpen(true)}
              className="px-5 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>Proponer Objetivo</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics Inside Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 mt-6">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
              <Clock className="w-4 h-4" />
              <span>HORAS TOTALES</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalTeamHours.toFixed(1)}h</div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>HITOS HECHOS</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalCompletedTasks}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono">
              <Target className="w-4 h-4" />
              <span>OBJETIVOS ACTIVOS</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalPendingObjectives}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-mono">
              <Users className="w-4 h-4" />
              <span>CORE FOUNDERS</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{admins.length}</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filter Pills & Report Export */}
      <div className="flex items-center justify-between gap-3 flex-wrap text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedAdminId('all')}
            className={`px-3.5 py-1.5 rounded-xl border transition shrink-0 cursor-pointer font-mono ${
              selectedAdminId === 'all'
                ? 'bg-emerald-500 text-black font-extrabold shadow-sm border-emerald-400'
                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Todos los Admins ({admins.length})
          </button>
          {admins.map(a => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelectedAdminId(a.id)}
              className={`px-3.5 py-1.5 rounded-xl border transition shrink-0 flex items-center gap-2 cursor-pointer font-mono ${
                selectedAdminId === a.id
                  ? 'bg-emerald-500 text-black font-extrabold shadow-sm border-emerald-400'
                  : 'bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: a.color }} />
              <span>{a.name} ({a.totalHours}h)</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopyReport}
          className="p-2 px-3 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer text-xs flex items-center gap-1.5 font-mono"
          title="Copiar resumen del equipo para WhatsApp o reuniones"
        >
          {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
          <span>{copiedReport ? 'Reporte Copiado' : 'Copiar Resumen WhatsApp'}</span>
        </button>
      </div>

      {/* Admin Cards Grid (Clean Obsidian Surface) */}
      <div className={`grid gap-6 ${displayedAdmins.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 lg:grid-cols-3'}`}>
        {displayedAdmins.map(admin => (
          <div
            key={admin.id}
            className="p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-white/10 hover:border-white/20 transition shadow-xl space-y-5 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Top: Identity & Hours */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-base shadow-md shrink-0 border"
                    style={{ 
                      borderColor: `${admin.color}40`, 
                      backgroundColor: `${admin.color}15`, 
                      color: admin.color 
                    }}
                  >
                    {admin.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-emerald-300 transition">
                        {admin.name}
                      </h3>
                      <span 
                        className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border"
                        style={{ 
                          backgroundColor: `${admin.color}15`, 
                          color: admin.color, 
                          borderColor: `${admin.color}35` 
                        }}
                      >
                        Admin
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono">
                      {admin.role}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-zinc-500 block uppercase">Dedicación:</span>
                  <span className="text-2xl font-black font-mono text-white" style={{ color: admin.color }}>
                    {admin.totalHours}h
                  </span>
                </div>
              </div>

              {/* Hours Breakdown Box */}
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-zinc-500">ÁREAS DE ENFOQUE:</span>
                  <span className="text-zinc-400">{admin.subRole || 'Co-Fundador'}</span>
                </div>
                <div className="space-y-1 pt-0.5">
                  {(admin.hoursBreakdown || []).map((h, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 truncate max-w-[200px]">{h.area}</span>
                      <span className="text-white font-semibold">{h.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: TRABAJO REALIZADO */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="uppercase tracking-wider">Hecho ({(admin.doneTasks || []).length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetAdminForDone(admin.id);
                      setIsAddDoneModalOpen(true);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  {(admin.doneTasks || []).map(task => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-white/15 transition space-y-1 group/task"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs text-zinc-200 font-medium leading-snug">
                          {task.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteDoneTask(admin.id, task.id)}
                          className="opacity-0 group-hover/task:opacity-100 text-zinc-500 hover:text-rose-400 transition p-0.5 shrink-0 cursor-pointer"
                          title="Eliminar tarea"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                        <span className="text-emerald-400 font-bold">{task.hours}h</span>
                        <span>•</span>
                        <span className="text-zinc-400">{task.category || 'General'}</span>
                        <span>•</span>
                        <span>{task.date || 'Reciente'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: PRÓXIMOS OBJETIVOS */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span className="uppercase tracking-wider">Objetivos ({(admin.todoTasks || []).length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetAdminForTodo(admin.id);
                      setIsAddTodoModalOpen(true);
                    }}
                    className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Añadir</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                  {(admin.todoTasks || []).length === 0 ? (
                    <div className="text-[11px] text-zinc-500 font-mono italic p-3 text-center rounded-xl bg-zinc-900/40 border border-white/5">
                      Sin objetivos pendientes.
                    </div>
                  ) : (
                    (admin.todoTasks || []).map(task => (
                      <div
                        key={task.id}
                        className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-amber-500/20 transition flex items-start justify-between gap-2.5 group/todo"
                      >
                        <div className="space-y-1 flex-1">
                          <p className="text-xs text-zinc-300 leading-snug">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-mono">
                            <span className={`px-1.5 py-0.5 rounded border ${
                              task.priority === 'Alta'
                                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            }`}>
                              Prioridad {task.priority}
                            </span>
                            <span className="text-zinc-500">{task.category || 'Objetivo'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleCompleteTodoTask(admin.id, task.id)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition cursor-pointer"
                            title="Marcar como hecha e ingresar horas"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTodoTask(admin.id, task.id)}
                            className="opacity-0 group-hover/todo:opacity-100 p-1.5 text-zinc-500 hover:text-rose-400 transition cursor-pointer"
                            title="Eliminar objetivo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[11px] text-zinc-500 font-mono">
                {admin.name} • TecnOdiel Core
              </span>
              <button
                type="button"
                onClick={() => {
                  setTargetAdminForDone(admin.id);
                  setIsAddDoneModalOpen(true);
                }}
                className="p-2 px-3 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer text-xs flex items-center gap-1.5 font-mono"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Registrar Horas</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: ADD DONE TASK & HOURS */}
      {isAddDoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <form 
            onSubmit={handleSaveDoneTask}
            className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Registrar Trabajo Realizado & Horas</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddDoneModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">¿Quién lo ha hecho?</label>
              <select
                value={targetAdminForDone}
                onChange={e => setTargetAdminForDone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              >
                <option value="mario">Mario</option>
                <option value="javier">Javier</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">¿Qué has hecho exactamente?</label>
              <textarea
                required
                rows={3}
                placeholder="ej: Creación de 5 nuevas plantillas de marisquerías y optimización de animaciones..."
                value={newDoneTitle}
                onChange={e => setNewDoneTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Horas dedicadas:</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  placeholder="ej: 3.5"
                  value={newDoneHours}
                  onChange={e => setNewDoneHours(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Categoría / Área:</label>
                <input
                  type="text"
                  placeholder="ej: Desarrollo, Diseño, Ventas..."
                  value={newDoneCategory}
                  onChange={e => setNewDoneCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsAddDoneModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-bold transition shadow-lg"
              >
                Guardar y Sumar Horas
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: ADD TODO / OBJECTIVE */}
      {isAddTodoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <form 
            onSubmit={handleSaveTodoTask}
            className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Proponer Próximo Objetivo ("Lo que quiere hacer")</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddTodoModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Para quién es el objetivo:</label>
              <select
                value={targetAdminForTodo}
                onChange={e => setTargetAdminForTodo(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
              >
                <option value="mario">Mario</option>
                <option value="javier">Javier</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Descripción del objetivo:</label>
              <textarea
                required
                rows={3}
                placeholder="ej: Realizar sesión de fotos a los 3 primeros restaurantes en Huelva..."
                value={newTodoTitle}
                onChange={e => setNewTodoTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Nivel de Prioridad:</label>
                <select
                  value={newTodoPriority}
                  onChange={e => setNewTodoPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                >
                  <option value="Alta">Alta (Inmediata)</option>
                  <option value="Media">Media (Esta semana)</option>
                  <option value="Baja">Baja (Roadmap futuro)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">Área / Etiqueta:</label>
                <input
                  type="text"
                  placeholder="ej: Producto, Ventas, Legal..."
                  value={newTodoCategory}
                  onChange={e => setNewTodoCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsAddTodoModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition shadow-lg"
              >
                Añadir al Roadmap
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
