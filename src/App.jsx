import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { 
  Home, Settings, Users, ShoppingCart, DollarSign, FileText, 
  BarChart2, Search, Bell, MessageSquare, X, Send, Clock, 
  Inbox, Minimize2, Maximize2, AlertTriangle, Activity, Layout,
  ArrowLeft, Check, Zap, Lock, Mail, MessageCircle, UserCheck, TrendingUp, BellOff,
  Download, File, Package, AlertCircle, TrendingDown
} from 'react-feather';

// --- ESTILOS CSS EN LÍNEA (Single File Mandate) ---
const styles = `
/* --- VARIABLES GLOBALES & PALETA --- */
:root {
  /* Paleta Corporativa */
  --color-primary-dark: #2D5D9B;  /* Azul Corporativo Oscuro */
  --color-primary: #4A90E2;       /* Azul Brillante */
  --color-accent: #6c5ce7;        /* Púrpura para nodos principales */
  --color-bg-light: #F5F7FA;      /* Fondo General */
  --color-white: #FFFFFF;
  --color-gray-border: #E1E4E8;   /* Bordes */
  --color-gray-pale: #F0F2F4;     /* Fondos secundarios */
  --color-text-main: #2c3e50;
  --color-text-muted: #7f8c8d;

  /* Semáforo de Riesgos */
  --risk-high: #e74c3c;
  --risk-medium: #f1c40f;
  --risk-low: #2ecc71;

  /* Dimensiones */
  --sidebar-width: 260px;
  --header-height: 70px;
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;
  
  /* Sombras */
  --shadow-card: 0 4px 12px rgba(0,0,0,0.05);
  --shadow-float: 0 8px 30px rgba(0,0,0,0.12);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-family);
  background-color: var(--color-bg-light);
  color: var(--color-text-main);
  overflow: hidden; /* App de escritorio, sin scroll en body */
}

/* --- LAYOUT PRINCIPAL --- */
.app-container {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: var(--header-height) 1fr;
  height: 100vh;
  width: 100vw;
}

/* --- SIDEBAR --- */
.sidebar {
  grid-row: 1 / -1;
  background-color: var(--color-white);
  border-right: 1px solid var(--color-gray-border);
  display: flex;
  flex-direction: column;
  padding: 25px 20px;
  z-index: 10;
}

.profile-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  text-align: center;
}

.profile-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary);
  padding: 2px;
  background: white;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  color: var(--color-text-muted);
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.menu-item:hover {
  background-color: var(--color-bg-light);
  color: var(--color-primary-dark);
}

.menu-item.active {
  background-color: var(--color-primary-dark);
  color: white;
  box-shadow: 0 4px 10px rgba(45, 93, 155, 0.3);
}

.tag-new {
  background: var(--risk-high);
  color: white;
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: auto;
  font-weight: 700;
  text-transform: uppercase;
}

/* --- HEADER --- */
.header {
  grid-column: 2 / -1;
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 20px;
  color: var(--color-text-muted);
}

.header-icons svg {
  cursor: pointer;
  transition: color 0.2s;
}

.header-icons svg:hover {
  color: var(--color-primary);
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: var(--risk-high);
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid var(--color-white);
}

/* --- MAIN CONTENT AREA --- */
.content-area {
  grid-column: 2 / -1;
  background: var(--color-bg-light);
  position: relative;
  overflow: auto;
  height: 100%;
}

/* Estilo específico para el Mapa de Procesos (Dashboard Home) */
.dashboard-canvas {
  background: linear-gradient(135deg, #F5F7FA 0%, #E4E7EB 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

/* --- NUEVO APARTADO: INVENTARIOS --- */
.inventory-container {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.inv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.inv-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-gray-border);
}

.stat-card h5 { margin: 0 0 10px; color: var(--color-text-muted); font-size: 0.85rem; }
.stat-card .value { font-size: 1.8rem; font-weight: 700; color: var(--color-text-main); }
.stat-card .trend { font-size: 0.8rem; margin-top: 5px; display: flex; align-items: center; gap: 4px; }
.trend.up { color: var(--risk-low); }
.trend.down { color: var(--risk-high); }

.inv-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
  border: 1px solid var(--color-gray-border);
}

.inv-table {
  width: 100%;
  border-collapse: collapse;
}

.inv-table th {
  background: var(--color-gray-pale);
  padding: 15px 20px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.inv-table td {
  padding: 15px 20px;
  border-bottom: 1px solid var(--color-gray-border);
  font-size: 0.9rem;
}

.status-pill {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}
.status-pill.ok { background: #e8f8f5; color: #27ae60; }
.status-pill.low { background: #fef9e7; color: #f1c40f; }
.status-pill.critical { background: #fdedec; color: #e74c3c; }

/* --- MAPA DE PROCESOS ESTILOS --- */
.process-map {
  position: relative;
  width: 800px;
  height: 600px;
}

/* Capa SVG para líneas */
.connections-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Permite clicks a través de las líneas */
  z-index: 0;
}

.connection-line {
  stroke: #bdc3c7;
  stroke-width: 2;
  stroke-dasharray: 6; /* Línea punteada */
}

/* Nodo Central */
.center-node {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px;
  height: 160px;
  background: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 0 10px rgba(255,255,255,0.5), var(--shadow-float);
  z-index: 2;
}

.center-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: var(--color-accent);
  border-right-color: var(--color-primary);
  border-bottom-color: var(--risk-low);
  border-left-color: var(--risk-medium);
  animation: spin 15s linear infinite;
}

.center-bar {
  width: 50px;
  height: 4px;
  background: linear-gradient(to right, var(--color-accent), var(--color-primary));
  margin-top: 8px;
  border-radius: 2px;
}
/* Nodos Satélite */
.node {
  position: absolute;
  background: white;
  padding: 10px 20px;
  border-radius: 50px;
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: var(--color-text-main);
  font-size: 0.9rem;
  transition: transform 0.2s;
  cursor: pointer;
  z-index: 1;
  white-space: nowrap;
  
  /* FIX: Esto centra el nodo exactamente en su coordenada */
  transform: translate(-50%, -50%);
}

.node:hover {
  /* FIX: Mantenemos el centrado al hacer hover y escalamos */
  transform: translate(-50%, -50%) scale(1.05);
  box-shadow: var(--shadow-float);
  z-index: 10; /* Traer al frente al pasar el mouse */
}

.node-icon-bg {
  width: 36px;
  height: 36px;
  background: var(--color-gray-pale);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; /* Evita que el icono se aplaste */
}

/* Posicionamiento Manual Corregido (Más espaciado) */
.pos-1 { top: 12%; left: 20%; } 
.pos-2 { top: 10%; left: 50%; } 
.pos-3 { top: 12%; left: 80%; }

.pos-4 { top: 32%; left: 10%; } 
.pos-5 { top: 32%; left: 90%; } 

.pos-6 { top: 50%; left: 5%; } 
.pos-7 { top: 50%; left: 95%; }

.pos-8 { top: 68%; left: 10%; } 
.pos-9 { top: 68%; left: 90%; } 

.pos-10 { top: 88%; left: 30%; } 
.pos-11 { top: 88%; left: 70%; }

/* --- WEB ALERT BANNER --- */
.web-alert-banner {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-left: 5px solid var(--risk-high);
  color: var(--color-text-main);
  padding: 15px 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  border-radius: 8px;
  z-index: 2000;
  display: flex;
  align-items: center;
  gap: 15px;
  animation: slideDown 0.3s ease-out;
  min-width: 400px;
}
.web-alert-banner svg { color: var(--risk-high); }
.web-alert-banner button {
  background: none; border: none; cursor: pointer; color: #999;
}

@keyframes slideDown {
  from { transform: translate(-50%, -20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

/* --- CHATBOT WINDOW --- */
.chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--color-white);
  border-radius: 16px;
  box-shadow: var(--shadow-float);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border: 1px solid var(--color-gray-border);
  overflow: visible; /* Permite ver los handlers de resize */
}

/* Header del Chat */
.chat-header {
  background: var(--color-primary-dark);
  color: white;
  padding: 15px 20px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.chat-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Cuerpo del Chat */
.chat-body {
  flex: 1;
  background-color: #f7f9fc;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  scroll-behavior: smooth;
}

/* Mensajes */
.msg {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.92rem;
  line-height: 1.5;
  max-width: 85%;
  position: relative;
  word-wrap: break-word;
}

.msg.bot {
  background: white;
  color: var(--color-text-main);
  border: 1px solid #eee;
  border-bottom-left-radius: 2px;
  align-self: flex-start;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}

.msg.user {
  background: var(--color-primary);
  color: white;
  border-bottom-right-radius: 2px;
  align-self: flex-end;
  box-shadow: 0 2px 5px rgba(74, 144, 226, 0.3);
}

.msg-meta {
  font-size: 0.65rem;
  opacity: 0.7;
  margin-top: 5px;
  display: block;
  text-align: right;
}

.risk-badge {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
}
.risk-badge.high { background-color: var(--risk-high); box-shadow: 0 0 5px var(--risk-high); }
.risk-badge.medium { background-color: var(--risk-medium); }

/* Opciones (Botones dentro del chat) */
.options-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.chat-option-btn {
  background: white;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  text-align: left;
  transition: all 0.2s;
}

.chat-option-btn:hover {
  background: var(--color-primary);
  color: white;
}

/* Footer (Input) */
.chat-footer {
  padding: 12px 15px;
  background: white;
  border-top: 1px solid var(--color-gray-border);
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}

.chat-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 10px 15px;
  outline: none;
  font-family: var(--font-family);
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: var(--color-primary);
}

.chat-action-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-action-btn:hover {
  background: var(--color-gray-pale);
  color: var(--color-primary);
}

.chat-action-btn.send {
  background: var(--color-primary);
  color: white;
}

.chat-action-btn.send:hover {
  background: var(--color-primary-dark);
}

/* --- OVERLAYS (Settings, History, Alertas) --- */
.overlay-view {
  position: absolute;
  top: 60px; /* Debajo del header */
  bottom: 60px; /* Encima del footer */
  left: 0;
  right: 0;
  background: white;
  z-index: 20;
  padding: 20px;
  overflow-y: auto;
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ESTILOS DE ALERTAS */
.alert-item {
  background: #fff;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.alert-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.alert-label {
  font-weight: 600;
  color: var(--color-text-main);
  font-size: 0.9rem;
}

.alert-control-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.alert-value {
  font-weight: 700;
  min-width: 45px;
  text-align: right;
  color: var(--color-primary-dark);
}
.alert-value.critical-text { color: var(--risk-high); }

/* Range Slider Customization */
.range-slider {
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  outline: none;
}
.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  transition: background .15s ease-in-out;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.range-slider.critical::-webkit-slider-thumb { background: var(--risk-high); }

/* Config styles reused */
.setting-group { margin-bottom: 25px; }
.setting-group label {
  display: block; font-weight: 600; margin-bottom: 10px; font-size: 0.9rem; color: var(--color-text-main);
}
.segmented-control {
  display: flex; background: var(--color-gray-pale); padding: 3px; border-radius: 8px;
}
.segmented-control button {
  flex: 1; border: none; background: transparent; padding: 8px; font-size: 0.8rem;
  border-radius: 6px; cursor: pointer; color: var(--color-text-muted);
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.segmented-control button.active {
  background: white; color: var(--color-primary-dark); font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* Switch Toggle (iOS style) */
.switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider {
  position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc; transition: .4s;
}
.slider.round { border-radius: 34px; }
.slider.round:before { border-radius: 50%; }
.slider:before {
  position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
  background-color: white; transition: .4s;
}
input:checked + .slider { background-color: var(--color-primary); }
input:checked + .slider:before { transform: translateX(20px); }

/* Botones de acción */
.save-btn {
  width: 100%; padding: 12px; background: var(--color-primary-dark); color: white;
  border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 10px;
  display: flex; align-items: center; justify-content: center;
}

/* Historial */
.history-item {
  padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;
}
.history-item:hover { background: var(--color-gray-pale); }
.history-text { display: block; font-weight: 500; font-size: 0.9rem; }
.history-time { display: block; font-size: 0.75rem; color: #999; margin-top: 4px; }

/* DevBox */
.dev-textarea {
  width: 100%; height: 120px; padding: 12px; border: 1px solid #ddd;
  border-radius: 8px; font-family: var(--font-family); resize: none;
}
.send-btn {
  flex: 2; background: var(--color-primary); color: white; border: none;
  padding: 10px; border-radius: 8px; cursor: pointer;
}
.cancel-btn {
  flex: 1; background: var(--color-gray-pale); color: #666; border: none;
  padding: 10px; border-radius: 8px; cursor: pointer;
}

/* --- MANEJADORES DE RESIZE (Invisibles) --- */
.resize-handle {
  position: absolute; z-index: 1002; background-color: transparent;
}
.resize-handle-top { top: -6px; left: 0; width: 100%; height: 12px; cursor: ns-resize; }
.resize-handle-left { top: 0; left: -6px; width: 12px; height: 100%; cursor: ew-resize; }
.resize-handle-corner { top: -6px; left: -6px; width: 16px; height: 16px; cursor: nwse-resize; z-index: 1003; }

/* Animaciones */
@keyframes spin { 100% { transform: rotate(360deg); } }
`;

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
    msg: "✅ Archivo <em>Reporte_Financiero_2025.xlsx</em> generado y descargado correctamente.",
    options: [{ text: "Gracias", next: "start" }]
  },
  download_pdf: {
    msg: "✅ Archivo <em>Alerta_Critica_Reporte.pdf</em> generado y listo para impresión.",
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

// Componente de Alerta Web Flotante
const WebAlert = ({ message, onClose }) => (
  <div className="web-alert-banner">
    <AlertTriangle size={24} />
    <div style={{flex: 1}}>
      <strong>ALERTA DEL SISTEMA</strong>
      <div>{message}</div>
    </div>
    <button onClick={onClose}><X size={18}/></button>
  </div>
);

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [globalAlert, setGlobalAlert] = useState(null);
  const [activeTab, setActiveTab] = useState('inicio'); // Estado para navegación
  
  return (
    <div className="app-container">
      <style>{styles}</style>
      {globalAlert && <WebAlert message={globalAlert} onClose={() => setGlobalAlert(null)} />}
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Header setChatOpen={setChatOpen} />
      
      <div className="content-area">
        {activeTab === 'inicio' && <DashboardAcademium />}
        {activeTab === 'inventarios' && <InventoryDashboard />}
        {activeTab !== 'inicio' && activeTab !== 'inventarios' && (
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%', color:'#999'}}>
            <h3>Módulo en construcción</h3>
          </div>
        )}
      </div>
      
      {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} setGlobalAlert={setGlobalAlert} />}
      
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

const ChatWidget = ({ onClose, setGlobalAlert }) => {
  const [size, setSize] = useState(() => {
    const saved = localStorage.getItem('academium_chat_size');
    if (saved) {
      const parsed = JSON.parse(saved);
      const safeWidth = Math.min(parsed.width, window.innerWidth - 20);
      const safeHeight = Math.min(parsed.height, window.innerHeight - 40);
      return { width: safeWidth, height: safeHeight };
    }
    return { width: 380, height: 600 }; // Un poco más alto por defecto
  });

  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('chat'); // chat, history, settings, alerts
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para la configuración de alertas
  const [alertConfig, setAlertConfig] = useState({
    morosidad: { label: 'Morosidad de Pagos', value: 15, active: true },
    liquidez: { label: 'Índice de Liquidez', value: 45, active: false },
    presupuesto: { label: 'Ejecución Presupuestal', value: 80, active: true },
    becas: { label: 'Fondo de Becas Disp.', value: 25, active: true }
  });

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

  // Manejo de cambio en las alertas
  const handleAlertConfigChange = (key, field, newValue) => {
    setAlertConfig(prev => {
      const newState = { ...prev, [key]: { ...prev[key], [field]: newValue } };
      
      // LÓGICA DE ALERTA: Si está activa y el valor baja al 10% o menos
      if (field === 'value' && newState[key].active && newValue <= 10) {
        triggerCriticalAlert(newState[key].label, newValue);
      }
      
      // Si se activa el switch y ya estaba bajo
      if (field === 'active' && newValue === true && newState[key].value <= 10) {
        triggerCriticalAlert(newState[key].label, newState[key].value);
      }

      return newState;
    });
  };

  const triggerCriticalAlert = (label, value) => {
    // 1. Alerta en la Web
    setGlobalAlert(`Nivel Crítico Detectado: ${label} ha descendido al ${value}%.`);
    
    // 2. Comentario en el Chatbot
    // Pequeño debounce para no spamear si arrastran mucho
    // (En prod usaría lodash.debounce, aquí simplifico verificando el último mensaje)
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || !lastMsg.text.includes(label)) {
      addBotMessage(
        `🚨 <strong>ALERTA CRÍTICA DETECTADA</strong><br/>
         El indicador <em>${label}</em> está en <strong>${value}%</strong>.<br/>
         Se recomienda generar reporte inmediato.`,
        [
          { text: "📥 Descargar Excel", next: "download_excel" },
          { text: "📄 Descargar PDF", next: "download_pdf" }
        ]
      );
    }
  };

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

    const maxWidth = window.innerWidth - 20;
    const maxHeight = window.innerHeight - 40; 

    if (newWidth > maxWidth) newWidth = maxWidth;
    if (newHeight > maxHeight) newHeight = maxHeight;

    setSize({ width: newWidth, height: newHeight });
  };

  const stopResize = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResize);
    localStorage.setItem('academium_chat_size', JSON.stringify(size));
  };

  const addBotMessage = (text, options = []) => {
    setMessages(prev => [...prev, { sender: 'bot', text, options,Pk: Date.now(), timestamp: new Date() }]);
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

    const API_KEY = ""; // En este entorno no usaremos la API key de entorno

    try {
      // Simulación rápida si no hay API Key o para demos
      if (!API_KEY) {
        setTimeout(() => {
          addBotMessage("Estoy en modo demostración (sin API Key). Puedo mostrarte las alertas si vas a la pestaña de alertas y bajas un indicador al 10%.");
          setIsLoading(false);
        }, 1000);
        return;
      }

      // Este bloque nunca se ejecutará con la API_KEY vacía, pero se mantiene la estructura por si se añade luego.
      const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'X-Client-Name': 'Academium_Frontend'
        },
        body: JSON.stringify({
          model: 'command-r-plus-08-2024',
          message: userText,
          preamble: `Eres el Asistente Inteligente de "Academium".`,
          temperature: 0.3
        })
      });

      if (!response.ok) throw new Error('Error API');
      const data = await response.json();
      addBotMessage(data.text);

    } catch (error) {
      setTimeout(() => {
        addBotMessage("Modo simulación: Entendido. ¿Deseas ver el reporte de alertas?");
        setIsLoading(false);
      }, 1000);
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
             view === 'alerts' ? 'Alertas Financieras' :
             view === 'settings' ? 'Configuración' : 'Buzón TI'}
          </h4>
          {view === 'chat' && <small style={{fontSize: '0.7rem', opacity: 0.85}}>En línea • Academium AI</small>}
        </div>
      </div>

      <div className="chat-controls">
        {view === 'chat' && (
          <>
            <Tooltip title="Historial">
              <Clock size={18} style={{cursor: 'pointer', opacity: 0.9}} onClick={() => setView('history')} />
            </Tooltip>
            {/* NUEVO BOTÓN DE ALERTAS */}
            <Tooltip title="Alertas Financieras">
              <AlertTriangle size={18} style={{cursor: 'pointer', opacity: 0.9}} onClick={() => setView('alerts')} />
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

  // --- NUEVO RENDERIZADOR DE ALERTAS ---
  const renderAlerts = () => (
    <div className="overlay-view">
      <h3 style={{marginTop: 0, color: '#2D5D9B', fontSize: '1.1rem', borderBottom: '1px solid #eee', paddingBottom: 10}}>
        Control Financiero
      </h3>
      <p style={{fontSize: '0.85rem', color: '#666', marginBottom: 20}}>
        Configure los umbrales para recibir notificaciones automáticas.
      </p>

      {Object.entries(alertConfig).map(([key, config]) => (
        <div key={key} className="alert-item">
          <div className="alert-header-row">
            <span className="alert-label">{config.label}</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={config.active} 
                onChange={(e) => handleAlertConfigChange(key, 'active', e.target.checked)} 
              />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div className="alert-control-row">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={config.value} 
              className={`range-slider ${config.value <= 10 ? 'critical' : ''}`}
              onChange={(e) => handleAlertConfigChange(key, 'value', parseInt(e.target.value))}
              disabled={!config.active}
            />
            <span className={`alert-value ${config.value <= 10 ? 'critical-text' : ''}`}>
              {config.value}%
            </span>
          </div>
          {config.value <= 10 && config.active && (
            <div style={{fontSize: '0.75rem', color: '#e74c3c', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4}}>
              <AlertTriangle size={12}/> Nivel Crítico: Alerta enviada
            </div>
          )}
        </div>
      ))}

      <div style={{marginTop: 30}}>
        <button className="save-btn" onClick={() => setView('chat')}>
          <Check size={18} style={{marginRight: 8}} /> Guardar Cambios
        </button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="overlay-view">
      <div className="setting-group">
        <label>Motor de IA</label>
        <div className="segmented-control">
          <button className={settings.motorIA === 'estable' ? 'active' : ''} onClick={() => setSettings({...settings, motorIA: 'estable'})}>
            <UserCheck size={14} /> Estable
          </button>
          <button className={settings.motorIA === 'avanzado' ? 'active' : ''} onClick={() => setSettings({...settings, motorIA: 'avanzado'})}>
            <TrendingUp size={14} /> Pro
          </button>
        </div>
      </div>

      <div className="setting-group">
        <label>Nivel de Proactividad</label>
        <div className="segmented-control">
          <button className={settings.proactividad === 'reactivo' ? 'active' : ''} onClick={() => setSettings({...settings, proactividad: 'reactivo'})}>
            <MessageSquare size={14} /> Reactivo
          </button>
          <button className={settings.proactividad === 'proactivo' ? 'active' : ''} onClick={() => setSettings({...settings, proactividad: 'proactivo'})}>
            <Zap size={14} /> Proactivo
          </button>
        </div>
      </div>

      <div className="setting-group">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <label style={{marginBottom:0}}>Densidad de Datos (Compacto)</label>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={settings.densidad} 
              onChange={(e) => setSettings({...settings, densidad: e.target.checked})} 
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>

      <div className="setting-group">
        <label>Canal de Notificación</label>
        <div className="segmented-control">
          <button className={settings.canal === 'email' ? 'active' : ''} onClick={() => setSettings({...settings, canal: 'email'})}>
            <Mail size={14} /> Email
          </button>
          <button className={settings.canal === 'app' ? 'active' : ''} onClick={() => setSettings({...settings, canal: 'app'})}>
            <Bell size={14} /> App
          </button>
        </div>
      </div>

      <button className="save-btn" onClick={() => setView('chat')}>Guardar Configuración</button>
    </div>
  );

  const renderDevBox = () => (
    <div className="overlay-view">
      <h3 style={{marginTop: 0, color: '#2D5D9B', fontSize: '1.1rem', marginBottom: 15}}>Soporte TI / Feedback</h3>
      <div style={{marginBottom: 15}}>
        <label style={{display:'block', fontWeight:600, marginBottom:8, fontSize: '0.9rem'}}>Describe el problema o sugerencia:</label>
        <textarea className="dev-textarea" placeholder="Escribe aquí..."></textarea>
      </div>
      <div style={{display:'flex', gap: 10}}>
        <button className="cancel-btn" onClick={() => setView('chat')}>Cancelar</button>
        <button className="send-btn" onClick={() => {
           setView('chat'); 
           addBotMessage("He recibido tu reporte #TI-2930. El equipo técnico lo revisará pronto.");
        }}>Enviar Reporte</button>
      </div>
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
      {view === 'alerts' && renderAlerts()}
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
          placeholder="Escribe tu consulta..."
          disabled={view !== 'chat' || isLoading}
        />
        <button className="chat-action-btn send" onClick={handleSend} disabled={view !== 'chat' || isLoading}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab }) => (
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
      <MenuItem 
        icon={<Home size={18} />} 
        text="Inicio" 
        active={activeTab === 'inicio'} 
        onClick={() => setActiveTab('inicio')}
      />
      <MenuItem 
        icon={<Settings size={18} />} 
        text="Configuración" 
        active={activeTab === 'config'} 
        onClick={() => setActiveTab('config')}
      />
      <MenuItem 
        icon={<Users size={18} />} 
        text="Talento Humano" 
        active={activeTab === 'rrhh'} 
        onClick={() => setActiveTab('rrhh')}
      />
      <MenuItem 
        icon={<DollarSign size={18} />} 
        text="Ventas" 
        active={activeTab === 'ventas'} 
        onClick={() => setActiveTab('ventas')}
      />
      <MenuItem 
        icon={<ShoppingCart size={18} />} 
        text="Compras" 
        active={activeTab === 'compras'} 
        onClick={() => setActiveTab('compras')}
      />
      <MenuItem 
        icon={<Layout size={18} />} 
        text="Inventarios" 
        isNew 
        active={activeTab === 'inventarios'} 
        onClick={() => setActiveTab('inventarios')}
      />
      <MenuItem 
        icon={<BarChart2 size={18} />} 
        text="Contabilidad" 
        active={activeTab === 'contabilidad'} 
        onClick={() => setActiveTab('contabilidad')}
      />
    </nav>
  </aside>
);

const MenuItem = ({ icon, text, active, isNew, onClick }) => (
  <div className={`menu-item ${active ? 'active' : ''}`} onClick={onClick}>
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
    <div className="dashboard-canvas">
      <div className="process-map">
        <svg className="connections-layer">
          <line x1="400" y1="300" x2="160" y2="72" className="connection-line" />
          <line x1="400" y1="300" x2="400" y2="60" className="connection-line" />
          <line x1="400" y1="300" x2="640" y2="72" className="connection-line" />
          <line x1="400" y1="300" x2="80" y2="192" className="connection-line" />
          <line x1="400" y1="300" x2="720" y2="192" className="connection-line" />
          <line x1="400" y1="300" x2="40" y2="300" className="connection-line" />
          <line x1="400" y1="300" x2="760" y2="300" className="connection-line" />
          <line x1="400" y1="300" x2="80" y2="408" className="connection-line" />
          <line x1="400" y1="300" x2="720" y2="408" className="connection-line" />
          <line x1="400" y1="300" x2="240" y2="528" className="connection-line" />
          <line x1="400" y1="300" x2="560" y2="528" className="connection-line" />
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
    </div>
  );
};

// --- COMPONENTE DE NUEVO APARTADO: INVENTARIOS ---
const InventoryDashboard = () => {
  return (
    <div className="inventory-container">
      <div className="inv-header">
        <div>
          <h2 style={{margin: '0 0 5px', color: '#2c3e50'}}>Control de Inventarios</h2>
          <small style={{color: '#7f8c8d'}}>Gestión de suministros educativos y papelería</small>
        </div>
        <button className="save-btn" style={{width: 'auto', padding: '10px 20px', marginTop: 0}}>
          <Package size={18} style={{marginRight: 8}} /> Nuevo Ítem
        </button>
      </div>

      <div className="inv-stats-grid">
        <div className="stat-card">
          <h5>TOTAL ÍTEMS</h5>
          <div className="value">1,240</div>
          <div className="trend up"><TrendingUp size={14} /> +12% vs mes pasado</div>
        </div>
        <div className="stat-card">
          <h5>VALORIZACIÓN</h5>
          <div className="value">$45,200</div>
          <div className="trend up"><TrendingUp size={14} /> +5% vs mes pasado</div>
        </div>
        <div className="stat-card">
          <h5>ALERTA STOCK BAJO</h5>
          <div className="value" style={{color: 'var(--risk-high)'}}>8</div>
          <div className="trend down"><AlertCircle size={14} /> Requiere atención</div>
        </div>
        <div className="stat-card">
          <h5>PEDIDOS PENDIENTES</h5>
          <div className="value">3</div>
          <div className="trend"><Clock size={14} /> Entrega estimada: 2d</div>
        </div>
      </div>

      <div className="inv-table-container">
        <table className="inv-table">
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>PRODUCTO</th>
              <th>CATEGORÍA</th>
              <th>STOCK ACTUAL</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'PAP-001', name: 'Resma Papel Bond A4', cat: 'Papelería', stock: 150, status: 'ok', label: 'Disponible' },
              { id: 'TEC-042', name: 'Marcadores Pizarra Azul', cat: 'Suministros', stock: 12, status: 'low', label: 'Bajo Stock' },
              { id: 'LIM-103', name: 'Alcohol Industrial 5L', cat: 'Limpieza', stock: 5, status: 'critical', label: 'Crítico' },
              { id: 'LIB-201', name: 'Libro Matemáticas 10mo', cat: 'Textos', stock: 85, status: 'ok', label: 'Disponible' },
              { id: 'TEC-088', name: 'Cable HDMI 3m', cat: 'Tecnología', stock: 0, status: 'critical', label: 'Agotado' },
            ].map((item, i) => (
              <tr key={i}>
                <td style={{fontWeight: 600, color: '#555'}}>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.cat}</td>
                <td style={{fontWeight: 'bold'}}>{item.stock} un.</td>
                <td>
                  <span className={`status-pill ${item.status}`}>{item.label}</span>
                </td>
                <td>
                  <Settings size={16} color="#95a5a6" style={{cursor: 'pointer'}} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Node = ({ pos, icon, title }) => (
  <div className={`node ${pos}`}>
    <div className="node-icon-bg">{icon}</div>
    <span>{title}</span>
  </div>
);

export default App;