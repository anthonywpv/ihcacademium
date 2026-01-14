import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { 
  Home, Settings, Users, ShoppingCart, DollarSign, FileText, 
  BarChart2, Search, Bell, MessageSquare, X, Send, Clock, 
  Inbox, Minimize2, Maximize2, AlertTriangle, Activity, Layout,
  ArrowLeft, Check, Zap, Lock, Mail, MessageCircle, UserCheck, TrendingUp, BellOff
} from 'react-feather';

const initialChatFlow = {
  start: {
    msg: "Hola, Gerente. He detectado actualizaciones críticas en los últimos 30 minutos. ¿Qué deseas revisar?",
    options: [
      { text: "📊 Riesgo Financiero", next: "risk_finance" },
      { text: "👥 Riesgo Talento Humano", next: "risk_hr" },
      { text: "🎓 Riesgo Académico", next: "risk_academic" },
      { text: "📈 Proyección de Ventas", next: "sales_forecast" }
    ]
  },
  risk_finance: {
    msg: "<strong>Análisis Financiero:</strong><br/>Cartera vencida ha aumentado un 5% este mes. <br/><br/><span class='risk-badge high'></span> Riesgo Alto en liquidez inmediata.",
    options: [
      { text: "Ver detalle de deudores", next: "finance_details" },
      { text: "Sugerir plan de cobro", next: "finance_plan" },
      { text: "Volver al inicio", next: "start" }
    ]
  },
  finance_details: {
    msg: "He generado un reporte en Excel con los 50 estudiantes con mayor deuda. ¿Deseas descargarlo o enviarlo a contabilidad?",
    options: [
      { text: "Descargar Excel", next: "download_excel" },
      { text: "Enviar a Contabilidad", next: "email_sent" }
    ]
  },
  risk_hr: {
    msg: "<strong>Talento Humano:</strong><br/>Se detecta un índice de rotación del 12% en el área docente.<br/><br/><span class='risk-badge medium'></span> Riesgo Medio operativo.",
    options: [{ text: "Analizar causas", next: "hr_causes" }, { text: "Volver", next: "start" }]
  },
  hr_causes: {
    msg: "Las encuestas de salida indican 'Salario no competitivo' como la causa principal (60%).",
    options: [{ text: "Volver", next: "start" }]
  },
  download_excel: {
    msg: "✅ Archivo <em>Reporte_Mora_2025.xlsx</em> generado y descargado correctamente.",
    options: [{ text: "Gracias", next: "start" }]
  },
  email_sent: {
    msg: "✅ Correo enviado al Jefe Financiero con el reporte adjunto.",
    options: [{ text: "Gracias", next: "start" }]
  },
  risk_academic: { msg: "Datos académicos estables. No hay alertas.", options: [{ text: "Volver", next: "start" }] },
  sales_forecast: { msg: "Proyección: +3% vs mes anterior.", options: [{ text: "Volver", next: "start" }] },
  finance_plan: { msg: "Plan sugerido: Campaña de descuentos por pronto pago.", options: [{ text: "Volver", next: "start" }] }
};

const Tooltip = ({ title, children }) => (
  <div title={title} style={{ display: 'inline-flex', cursor: 'help' }}>
    {children}
  </div>
);

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  
  return (
    <div className="app-container">
      <Sidebar />
      <Header setChatOpen={setChatOpen} />
      <DashboardAcademium />
      
      {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} />}
      
      {!chatOpen && (
        <button 
          onClick={() => setChatOpen(true)}
          style={{
            position: 'fixed', bottom: 30, right: 30, 
            background: 'var(--color-primary-dark)', color: 'white',
            border: 'none', borderRadius: '50%', width: 60, height: 60,
            cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
}

const ChatWidget = ({ onClose }) => {
  const [size, setSize] = useState(() => {
    const saved = localStorage.getItem('academium_chat_size');
    return saved ? JSON.parse(saved) : { width: 380, height: 550 };
  });

  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('chat'); 
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    motorIA: 'estable', 
    proactividad: 'reactivo', 
    densidad: false, 
    canal: 'email' 
  });

  const chatRef = useRef(null);
  const isResizing = useRef(false);
  const resizeDir = useRef(null);
  const startPos = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const messagesEndRef = useRef(null);
  const hasInitialized = useRef(false); 

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      addBotMessage(initialChatFlow.start.msg, initialChatFlow.start.options);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, view, isLoading]);

  useEffect(() => {
    if(!isResizing.current) {
      localStorage.setItem('academium_chat_size', JSON.stringify(size));
    }
  }, [size]);

  const startResize = (e, direction) => {
    e.preventDefault();
    isResizing.current = true;
    resizeDir.current = direction;
    startPos.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResize);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;
    const deltaX = startPos.current.x - e.clientX; 
    const deltaY = startPos.current.y - e.clientY;
    
    let newWidth = startPos.current.w;
    let newHeight = startPos.current.h;

    if (resizeDir.current === 'left' || resizeDir.current === 'corner') newWidth += deltaX;
    if (resizeDir.current === 'top' || resizeDir.current === 'corner') newHeight += deltaY;

    if (newWidth < 320) newWidth = 320;
    if (newHeight < 400) newHeight = 400;
    if (newWidth > window.innerWidth - 20) newWidth = window.innerWidth - 20;

    setSize({ width: newWidth, height: newHeight });
  };

  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
    localStorage.setItem('academium_chat_size', JSON.stringify(size));
  };

  const addBotMessage = (text, options = []) => {
    setMessages(prev => [...prev, { sender: 'bot', text, options, timestamp: new Date() }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { sender: 'user', text, timestamp: new Date() }]);
    if (messages.length > 1 && view === 'chat') {
      setHistory(prev => [{ summary: text.substring(0, 25) + "...", date: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
    }
  };

  const handleOptionClick = (option) => {
    addUserMessage(option.text);
    if(initialChatFlow[option.next]) {
      setTimeout(() => {
        const step = initialChatFlow[option.next];
        addBotMessage(step.msg, step.options);
      }, 600);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    
    addUserMessage(userText);
    setInput('');
    setIsLoading(true);

    const API_KEY = import.meta.env.VITE_COHERE_API_KEY;

    try {
      // Usamos el endpoint .ai para evitar bloqueos y el nombre de modelo actualizado
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'X-Client-Name': 'Academium_Frontend'
        },
        body: JSON.stringify({
          model: 'command-r-plus-08-2024', // Modelo actualizado y soportado
          message: userText,
          preamble: `Eres el Asistente Inteligente de "Academium", un sistema ERP educativo.
            Tu rol es ayudar a Rectores y Gerentes.
            
            REGLAS DE COMPORTAMIENTO:
            1. Si te piden datos (ventas, alumnos, notas), GENERA datos simulados pero REALISTAS y LÓGICOS.
            2. Si te piden descargar un reporte:
               - Confirma la acción y pregunta formato (PDF/Excel).
            3. Sé profesional y conciso.`,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error ${response.status}: ${errorData.message || 'Error desconocido'}`);
      }

      const data = await response.json();
      addBotMessage(data.text);

    } catch (error) {
      console.error(error);
      addBotMessage(`⚠️ Error de conexión: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <div className="chat-header">
      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        {view !== 'chat' ? (
          <button 
            onClick={() => setView('chat')} 
            style={{background:'none', border:'none', color:'white', cursor:'pointer', padding: 0, display: 'flex'}}
            title="Volver al chat"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div style={{position: 'relative', width: 32, height: 32}}>
             <img 
               src="https://ui-avatars.com/api/?name=Bot&background=fff&color=2D5D9B" 
               style={{width: '100%', height: '100%', borderRadius: '50%'}} 
               alt="Bot" 
             />
             <span style={{position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, background: '#2ecc71', borderRadius: '50%', border: '1.5px solid #2D5D9B'}}></span>
          </div>
        )}
        
        <div>
          <h4 style={{margin: 0, fontSize: '0.95rem', lineHeight: '1.2'}}>
            {view === 'chat' ? 'Asistente Academium' : 
             view === 'history' ? 'Historial' : 
             view === 'settings' ? 'Configuración' : 'Buzón TI'}
          </h4>
          {view === 'chat' && <small style={{fontSize: '0.7rem', opacity: 0.85}}>Cohere AI • Conectado</small>}
        </div>
      </div>

      <div className="chat-controls">
        {view === 'chat' && (
          <>
            <Tooltip title="Historial">
              <Clock size={18} style={{cursor: 'pointer', opacity: 0.9}} onClick={() => setView('history')} />
            </Tooltip>
            <Tooltip title="Configuración">
              <Settings size={18} style={{cursor: 'pointer', opacity: 0.9}} onClick={() => setView('settings')} />
            </Tooltip>
          </>
        )}
        <X size={20} style={{cursor: 'pointer', marginLeft: 8}} onClick={onClose} />
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="overlay-view">
      <div className="setting-group">
        <label>Motor de IA (Fiabilidad)</label>
        <div className="segmented-control">
          <button className={settings.motorIA === 'estable' ? 'active' : ''} onClick={() => setSettings({...settings, motorIA: 'estable'})}>
            <UserCheck size={14} /> Estable
          </button>
          <button className={settings.motorIA === 'avanzado' ? 'active' : ''} onClick={() => setSettings({...settings, motorIA: 'avanzado'})}>
            <TrendingUp size={14} /> Pro
          </button>
          <button className={settings.motorIA === 'experimental' ? 'active' : ''} onClick={() => setSettings({...settings, motorIA: 'experimental'})}>
            <Zap size={14} /> Beta
          </button>
        </div>
      </div>

      <div className="setting-group">
        <label>Nivel de Proactividad</label>
        <div className="segmented-control">
          <button className={settings.proactividad === 'reactivo' ? 'active' : ''} onClick={() => setSettings({...settings, proactividad: 'reactivo'})}>
            <BellOff size={14} /> Reactivo
          </button>
          <button className={settings.proactividad === 'proactivo' ? 'active' : ''} onClick={() => setSettings({...settings, proactividad: 'proactivo'})}>
            <Bell size={14} /> Proactivo
          </button>
        </div>
      </div>

      <div className="setting-group row">
        <label>Densidad de Resúmenes</label>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <span style={{fontSize: '0.8rem', color: '#666'}}>{settings.densidad ? 'Detallado' : 'Simplificado'}</span>
          <label className="switch">
            <input type="checkbox" checked={settings.densidad} onChange={() => setSettings({...settings, densidad: !settings.densidad})} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="setting-group">
        <label>Canal Preferido</label>
        <div className="segmented-control">
          <button className={settings.canal === 'email' ? 'active' : ''} onClick={() => setSettings({...settings, canal: 'email'})}>
            <Mail size={14} /> Email
          </button>
          <button className={settings.canal === 'whatsapp' ? 'active' : ''} onClick={() => setSettings({...settings, canal: 'whatsapp'})}>
            <MessageCircle size={14} /> WhatsApp
          </button>
        </div>
      </div>

      <div className="setting-group">
        <button className="security-btn" onClick={() => alert("Modo Seguro Activado: Se requerirá 2FA para acciones sensibles.")}>
          <Lock size={14} /> Activar Modo Alta Seguridad
        </button>
      </div>

      <button className="save-btn" onClick={() => setView('chat')}>Guardar Cambios</button>
    </div>
  );

  const renderHistory = () => (
    <div className="overlay-view">
      {history.length === 0 ? (
        <div style={{textAlign: 'center', padding: 20, color: '#999'}}>
          <Clock size={40} style={{marginBottom: 10, opacity: 0.5}} />
          <p>No hay historial reciente.</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((h, i) => (
            <div key={i} className="history-item" onClick={() => { addUserMessage(h.summary); setView('chat'); }}>
              <span className="history-text">{h.summary}</span>
              <span className="history-time">{h.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDevBox = () => (
    <div className="overlay-view">
      <p style={{fontSize: '0.9rem', color: '#555', marginBottom: 15}}>
        Reporta errores o sugerencias a TI.
      </p>
      <textarea className="dev-textarea" placeholder="Describe el problema..."></textarea>
      <div style={{display: 'flex', gap: 10, marginTop: 15}}>
        <button className="cancel-btn" onClick={() => setView('chat')}>Cancelar</button>
        <button className="send-btn" onClick={() => { alert('¡Enviado!'); setView('chat'); }}>Enviar</button>
      </div>
    </div>
  );

  return (
    <div 
      className="chat-window" 
      ref={chatRef}
      style={{ width: size.width, height: size.height }}
    >
      <div className="resize-handle resize-handle-top" onMouseDown={(e) => startResize(e, 'top')}></div>
      <div className="resize-handle resize-handle-left" onMouseDown={(e) => startResize(e, 'left')}></div>
      <div className="resize-handle resize-handle-corner" onMouseDown={(e) => startResize(e, 'corner')}></div>

      {renderHeader()}
      
      <div className="chat-body">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.sender}`}>
            <span dangerouslySetInnerHTML={{__html: m.text}}></span>
            {m.options && (
              <div className="options-grid">
                {m.options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleOptionClick(opt)} className="chat-option-btn">
                    {opt.text}
                  </button>
                ))}
              </div>
            )}
            <span className="msg-meta">{m.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        ))}
        
        {isLoading && (
          <div className="msg bot">
            <span className="typing-indicator">Pensando... 📊</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {view === 'settings' && renderSettings()}
      {view === 'history' && renderHistory()}
      {view === 'devbox' && renderDevBox()}

      <div className="chat-footer">
        <button className="chat-action-btn" title="Buzón TI" onClick={() => setView('devbox')}>
          <Inbox size={20} />
        </button>
        <input 
          className="chat-input" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Pregunta o pide reportes..."
          disabled={view !== 'chat' || isLoading}
        />
        <button className="chat-action-btn send" onClick={handleSend} disabled={view !== 'chat' || isLoading}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

const Sidebar = () => (
  <aside className="sidebar">
    <div className="profile-section">
      <img src="https://i.pravatar.cc/150?img=68" alt="Profile" className="profile-img" />
      <h4 style={{margin: '10px 0 5px'}}>Paola Granizo</h4>
      <small style={{color: '#999'}}>Administradora</small>
      <button style={{
        marginTop: '10px', background: '#f1c40f', color: '#333', border: 'none', 
        padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem'
      }}>Cargar foto</button>
    </div>
    <nav style={{marginTop: 20}}>
      <MenuItem icon={<Home size={18} />} text="Inicio" active />
      <MenuItem icon={<Settings size={18} />} text="Configuración" />
      <MenuItem icon={<Users size={18} />} text="Talento Humano" />
      <MenuItem icon={<DollarSign size={18} />} text="Ventas" />
      <MenuItem icon={<ShoppingCart size={18} />} text="Compras" />
      <MenuItem icon={<Layout size={18} />} text="Inventarios" isNew />
      <MenuItem icon={<BarChart2 size={18} />} text="Contabilidad" />
    </nav>
  </aside>
);

const MenuItem = ({ icon, text, active, isNew }) => (
  <div className={`menu-item ${active ? 'active' : ''}`}>
    {icon}
    <span>{text}</span>
    {isNew && <span className="tag-new">Nuevo</span>}
  </div>
);

const Header = ({ setChatOpen }) => (
  <header className="header">
    <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
      <div style={{fontWeight: '800', fontSize: '1.1rem', color: 'var(--color-primary-dark)', letterSpacing: '0.5px'}}>
        UNIDAD EDUCATIVA SAGRADOS CORAZONES
      </div>
    </div>
    <div className="header-icons">
      <Search size={20} />
      <div style={{position: 'relative'}} onClick={() => setChatOpen(true)}>
        <MessageSquare size={20} />
        <span className="badge">3</span>
      </div>
      <Bell size={20} />
      <Users size={20} />
      <Maximize2 size={20} />
      <Home size={20} />
    </div>
  </header>
);

const DashboardAcademium = () => {
  return (
    <main className="dashboard-canvas">
      <div className="process-map">
        <svg className="connections-layer">
          <line x1="400" y1="300" x2="240" y2="60" className="connection-line" />
          <line x1="400" y1="300" x2="400" y2="60" className="connection-line" />
          <line x1="400" y1="300" x2="560" y2="60" className="connection-line" />
          <line x1="400" y1="300" x2="80" y2="180" className="connection-line" />
          <line x1="400" y1="300" x2="720" y2="180" className="connection-line" />
          <line x1="400" y1="300" x2="60" y2="300" className="connection-line" />
          <line x1="400" y1="300" x2="740" y2="300" className="connection-line" />
          <line x1="400" y1="300" x2="160" y2="480" className="connection-line" />
          <line x1="400" y1="300" x2="640" y2="480" className="connection-line" />
          <line x1="400" y1="300" x2="280" y2="540" className="connection-line" />
          <line x1="400" y1="300" x2="520" y2="540" className="connection-line" />
        </svg>

        <div className="center-node">
          <div className="center-ring"></div>
          <h2 style={{color: '#6c5ce7', margin: 0, fontWeight: 800}}>VENTAS</h2>
          <div className="center-bar"></div>
        </div>

        <Node pos="pos-1" icon={<Users color="#6c5ce7" />} title="Clientes" />
        <Node pos="pos-2" icon={<ShoppingCart color="#00cec9" />} title="Productos y Servicios" />
        <Node pos="pos-3" icon={<DollarSign color="#6c5ce7" />} title="Anticipos" />
        <Node pos="pos-4" icon={<FileText color="#6c5ce7" />} title="Servicios Académicos" />
        <Node pos="pos-5" icon={<FileText color="#6c5ce7" />} title="Notas de Crédito" />
        <Node pos="pos-6" icon={<Activity color="#6c5ce7" />} title="Descuentos Estudiantes" />
        <Node pos="pos-7" icon={<DollarSign color="#6c5ce7" />} title="Pagos Múltiples" />
        <Node pos="pos-8" icon={<Clock color="#00cec9" />} title="Meses a Facturar" />
        <Node pos="pos-9" icon={<FileText color="#00cec9" />} title="Generar Archivo Banco" />
        <Node pos="pos-10" icon={<FileText color="#fdcb6e" />} title="Facturas Estudiantes" />
        <Node pos="pos-11" icon={<Inbox color="#2ecc71" />} title="Cargar Archivo Banco" />
      </div>
    </main>
  );
};

const Node = ({ pos, icon, title }) => (
  <div className={`node ${pos}`}>
    <div className="node-icon-bg">{icon}</div>
    <span>{title}</span>
  </div>
);

export default App;