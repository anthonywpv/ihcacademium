import { useState, useEffect, useRef } from 'react';
import '/src/App.css'; // Importa la ruta absoluta

// --- Importación de Librerías ---
import { 
  User, Briefcase, Home, FileText, DollarSign, BarChart2, Users, 
  Bell, Settings, MessageSquare, X, Cpu, Lock, Send, ChevronLeft, 
  ChevronRight, UserCheck, LogOut, Mail, MessageCircle, AlertTriangle,
  TrendingUp, Zap, BellOff, Sliders
} from 'react-feather'; // Añadidos nuevos íconos
import { Pie, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  Title
} from 'chart.js';

// Registrar los componentes de Chart.js que vamos a usar
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

// --- Flujo de Conversación del Chatbot (Definición) ---
const chatFlow = {
  // --- INICIO Y BUCLES ---
  'start_no_intro': {
    message: null, 
    options: [],
    redirectTo: (role) => role === 'cliente' ? 'menu_cliente' : 'menu_gerente'
  },
  'volver_al_menu': {
    message: '¿Requieres consultar algo más?',
    options: [
      { text: 'Sí, volver al menú', nextStep: 'start_no_intro' },
      { text: 'No, gracias', nextStep: 'fin_conversacion' }
    ]
  },
  'fin_conversacion': {
    message: '¡De nada! Ha sido un placer ayudarte. Estoy aquí si me necesitas.'
  },
  'fallback_prompt': {
    message: 'No entendí tu solicitud. ¿Qué te gustaría hacer?',
    options: [
      { text: 'Ir al menú principal', nextStep: 'start_no_intro' },
      { text: 'Hablar con un operador (Cliente)', nextStep: 'hablar_agente' },
      { text: 'Reportar un problema (Admin)', nextStep: 'reportar_problema' }
    ]
  },

  // --- FLUJO CLIENTE ---
  'menu_cliente': {
    message: '¡Hola, {Nombre_Cliente}! Soy tu asistente. ¿Cómo puedo ayudarte hoy?',
    options: [
      { text: '¿Dónde pago mi factura?', nextStep: 'pago_factura' },
      { text: 'Reportar un pago', nextStep: 'reportar_pago' },
      { text: 'Ver mi historial de pagos', nextStep: 'historial_pagos' },
      { text: 'Hablar con un agente', nextStep: 'hablar_agente' }
    ]
  },
  'pago_factura': {
    message: 'Puedes pagar tu factura en línea con tarjeta de crédito, o en ventanilla en cualquier agencia del Banco Pichincha.',
    nextStep: 'volver_al_menu'
  },
  'reportar_pago': {
    message: '¡Genial! Por favor, ¿podrías indicarme el monto exacto que pagaste?',
    options: [
      { text: '$50.00 (Valor Pendiente)', nextStep: 'pago_reportado' },
      { text: 'Pagué otro valor', nextStep: 'pago_otro_valor' }
    ]
  },
  'pago_reportado': {
    message: '¡Perfecto! Hemos registrado tu pago de $50.00. Se verá reflejado en tu cuenta en las próximas 24 horas.',
    nextStep: 'volver_al_menu'
  },
  'pago_otro_valor': {
    message: 'No hay problema. Por favor, contacta a un agente para verificar el pago manualmente.',
    nextStep: 'volver_al_menu'
  },
  'historial_pagos': {
    message: 'Aquí tienes un carrusel con tus últimos 3 pagos:',
    carousel: [
      { title: 'Factura Octubre', content: 'Pagada el 01/Nov. Monto: $250.00' },
      { title: 'Factura Septiembre', content: 'Pagada el 02/Oct. Monto: $250.00' },
      { title: 'Factura Agosto', content: 'Pagada el 01/Sep. Monto: $250.00' }
    ],
    nextStep: 'volver_al_menu'
  },
  'hablar_agente': {
    message: 'Entendido. Por favor, describe brevemente tu problema a continuación y un agente se conectará a este chat.',
    awaitInput: 'agente_contactado'
  },
  'agente_contactado': {
    message: '¡Gracias! Tu mensaje ha sido registrado. Un operador se pondrá en contacto contigo en breve.',
    nextStep: 'volver_al_menu'
  },

  // --- FLUJO GERENTE (REDISEÑADO) ---
  'menu_gerente': {
    message: 'Hola {Nombre_Administrativo}, bienvenido. ¿En qué te ayudo a profundizar?',
    options: [
      { text: 'Análisis Predictivo: Predecir recaudación', nextStep: 'predecir_recaudacion' },
      { text: 'Análisis Comparativo: vs. Año Anterior', nextStep: 'comparar_recaudacion' },
      { text: 'Análisis de Riesgo: Detectar deserción', nextStep: 'riesgo_desercion' },
      { text: 'Reporte: Generar cartera vencida', nextStep: 'reporte_cartera' },
      { text: 'Sensible: Ver listado de salarios', nextStep: 'info_sensible' },
      { text: 'Soporte: Reportar un problema', nextStep: 'reportar_problema' }
    ]
  },
  'predecir_recaudacion': { // NUEVO
    message: 'Calculando... Basado en la tendencia de los últimos 6 meses y la matrícula activa, se proyecta una recaudación de **$155,000** para el próximo mes (un 3% de incremento). ¿Deseas ver el análisis detallado?',
    options: [
      { text: 'Sí, ver detalle', nextStep: 'detalle_prediccion' },
      { text: 'No, gracias', nextStep: 'start_no_intro' }
    ]
  },
  'detalle_prediccion': { // NUEVO
    message: 'El análisis predictivo considera: <br> - Tendencia histórica: +$3,500 <br> - Nuevos estudiantes: +$2,000 <br> - Tasa de morosidad proyectada: -$1,000',
    nextStep: 'volver_al_menu'
  },
  'comparar_recaudacion': { // NUEVO
    message: 'Aquí tienes la comparativa de recaudación (Ene-Oct):<br> - **Año Actual:** $1,450,000<br> - **Año Anterior:** $1,320,000<br> <strong class="positive">Incremento: +9.8%</strong><br>¿Quieres analizar el mes con mayor diferencia?',
    options: [
      { text: 'Sí, analizar mes', nextStep: 'detalle_comparativa' },
      { text: 'No, gracias', nextStep: 'start_no_intro' }
    ]
  },
  'detalle_comparativa': { // NUEVO
    message: 'El mes con mayor diferencia fue **Agosto** (+22%), coincidiendo con la campaña de "pronto pago" de matrículas.',
    nextStep: 'volver_al_menu'
  },
  'riesgo_desercion': { // NUEVO
    message: 'He identificado a **15 estudiantes** con alto riesgo de deserción (basado en 2+ pensiones vencidas y nula comunicación). ¿Quieres ver el listado para que el dpto. de bienestar contacte?',
    carousel: [
      { title: 'J. Perez (ID 1123)', content: '3 pensiones vencidas. Último pago: Agosto.' },
      { title: 'M. Gonzalez (ID 1452)', content: '2 pensiones vencidas. Clic para ver historial.' },
      { title: 'A. Andrade (ID 1098)', content: '2 pensiones vencidas. Promedio bajo.' }
    ],
    nextStep: 'volver_al_menu'
  },
  'reporte_cartera': {
    message: 'Estoy generando el reporte de cartera vencida... Listo. ¿Deseas descargarlo en Excel o PDF?',
    options: [
      { text: 'Descargar en Excel', nextStep: 'descarga_exitosa' },
      { text: 'Descargar en PDF', nextStep: 'descarga_exitosa' }
    ]
  },
  'descarga_exitosa': {
    message: 'El archivo se ha descargado en tu dispositivo.',
    nextStep: 'volver_al_menu'
  },
  'info_sensible': {
    message: 'Estás solicitando <strong>información sensible</strong>. Por tu seguridad, esta información está encriptada y no puede mostrarse en un lugar público. ¿Confirmas que deseas verla?',
    options: [
      { text: 'Sí, mostrar información', nextStep: 'info_desencriptada' },
      { text: 'No, cancelar', nextStep: 'start_no_intro' }
    ]
  },
  'info_desencriptada': {
    message: 'Desencriptando... El total de la nómina del mes pasado fue de $45,300.00.',
    nextStep: 'volver_al_menu'
  },
  'reportar_problema': { 
    message: 'Por favor, describe el problema o error que encontraste. Tu reporte será enviado al equipo técnico.',
    awaitInput: 'problema_reportado'
  },
  'problema_reportado': { 
    message: '¡Gracias! Tu reporte ha sido enviado con éxito al equipo de desarrollo.',
    nextStep: 'volver_al_menu'
  },

  // --- FLUJO COMÚN (Desde Gráficos) ---
  'analisis_cliente_pie': {
    message: 'El gráfico "Gastos por Categoría" muestra que la <strong>Pensión (70%)</strong> es el rubro principal. ¿Te gustaría ver el detalle de "Otros"?',
    options: [
      { text: 'Sí, ver detalle', nextStep: 'detalle_otros' },
      { text: 'No, gracias', nextStep: 'start_no_intro' }
    ]
  },
  'detalle_otros': {
    message: 'El rubro "Otros" ($25.00) se compone de: <br> - Transporte de bus: $15.00 <br> - Venta de garage: $10.00',
    nextStep: 'volver_al_menu'
  },
  'analisis_cliente_bar': {
    message: 'Este gráfico muestra tus pagos de pensión de los últimos 6 meses. Se ve un pago duplicado en Septiembre. ¿Quieres reportar este pago?',
    options: [
      { text: 'Sí, reportar pago duplicado', nextStep: 'reportar_pago_duplicado' },
      { text: 'No, está correcto', nextStep: 'start_no_intro' }
    ]
  },
  'reportar_pago_duplicado': {
    message: 'Entendido. Hemos generado un ticket (N° 4582) para la revisión del pago duplicado de Septiembre. Te notificaremos por correo.',
    nextStep: 'volver_al_menu'
  },
  'analisis_admin_pie': {
    message: 'Este gráfico muestra que los pagos en <strong class="negative">Efectivo/Ventanilla (45%)</strong> siguen siendo el método más común. ¿Quieres ver el análisis estadístico de este grupo?',
    carousel: [
      { title: 'Análisis: Efectivo/Ventanilla (45%)', content: 'Este método es costoso de procesar. El 70% de estos usuarios son clientes de más de 5 años. Se recomienda una campaña de migración a débito automático.' },
      { title: 'Análisis: Tarjeta de Crédito (35%)', content: 'Ha crecido un 15% en los últimos 6 meses. La mayoría son pagos recurrentes automáticos de la pensión.' },
      { title: 'Análisis: Transferencia (20%)', content: 'Usado principalmente para pagos de matrícula. El 30% de las transferencias fallan por errores de digitación del código de estudiante.' }
    ],
    nextStep: 'volver_al_menu'
  },
  'analisis_admin_bar': {
    message: 'Este gráfico muestra un <strong class="positive">pico de recaudación los días Lunes</strong>, coincidiendo con el inicio de semana. El Jueves es el día más bajo. ¿Quieres cruzar esta data con los métodos de pago?',
    options: [
      { text: 'Sí, cruzar datos', nextStep: 'cruce_datos' },
      { text: 'No, gracias', nextStep: 'start_no_intro' }
    ]
  },
  'cruce_datos': {
    message: 'Análisis: Los Lunes, el 80% de los pagos son en Efectivo/Ventanilla. Los Viernes, el 60% de los pagos son con Tarjeta de Crédito.',
    nextStep: 'volver_al_menu'
  }
};

// --- Datos de los Gráficos (Mock) ---
const chartData = {
  clientPie: {
    data: {
      labels: ['Pensión (70%)', 'Matrícula (20%)', 'Otros (10%)'],
      datasets: [{
        data: [70, 20, 10],
        backgroundColor: ['#0056b3', '#007bff', '#6c757d'],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  },
  clientBar: { 
    data: {
      labels: ['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'],
      datasets: [{
        label: 'Monto Pagado ($)',
        data: [250, 250, 250, 250, 500, 250], 
        backgroundColor: (context) => {
          const value = context.dataset.data[context.dataIndex];
          return value > 250 ? '#dc3545' : '#007bff'; 
        },
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  },
  adminPie: {
    data: {
      labels: ['Efectivo/Ventanilla (45%)', 'Tarjeta de Crédito (35%)', 'Transferencia (20%)'],
      datasets: [{
        data: [45, 35, 20],
        backgroundColor: ['#0056b3', '#007bff', '#6c757d'],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  },
  adminBar: {
    data: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [{
        label: 'Recaudación ($)',
        data: [5200, 3100, 4200, 1500, 3800, 2100, 0],
        backgroundColor: '#007bff',
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true }
      }
    }
  }
};


// --- Componente Principal ---
function App() {
  const [userRole, setUserRole] = useState(null); 

  if (!userRole) {
    return <LoginScreen onLogin={setUserRole} />;
  }

  return <Dashboard userRole={userRole} onLogout={() => setUserRole(null)} />;
}

// --- Componente: Pantalla de Login ---
function LoginScreen({ onLogin }) {
  return (
    <div className="login-screen">
      <div className="login-container">
        <h1>Academium</h1>
        <h2>Portal de inicio de sesión</h2>
        <div className="login-options">
          <button onClick={() => onLogin('cliente')}>
            <User size={20} />
            Ingresar como Cliente
          </button>
          <button onClick={() => onLogin('admin')}>
            <Briefcase size={20} />
            Ingresar como Administrativo
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Componente: Dashboard Principal (Contenedor) ---
function Dashboard({ userRole, onLogout }) { 
  const [currentModal, setCurrentModal] = useState(null); 
  const [isChatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [analysisModal, setAnalysisModal] = useState({
    visible: false, title: '', summary: '', nextStep: '', x: 0, y: 0
  });

  // --- Lógica del Chat ---
  const [inputText, setInputText] = useState('');
  const [isAwaitingInput, setAwaitingInput] = useState(false);
  const [inputCallbackStep, setInputCallbackStep] = useState(null);
  
  const addMessageToChat = (sender, content, options = [], carousel = []) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      sender, content, options, carousel
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const showStep = (stepName) => {
    let step = chatFlow[stepName];
    if (!step) return;

    if (step.redirectTo) {
      const targetStep = step.redirectTo(userRole);
      step = chatFlow[targetStep];
    }
    
    const showBotMessage = () => {
      if (step.message) { 
        setChatMessages(prev => {
          const newMessages = prev.slice(0, -1); 
          const newMessage = {
            id: Date.now(),
            sender: 'bot',
            content: step.message.replace('{Nombre_Cliente}', 'Cliente').replace('{Nombre_Administrativo}', 'Administrador'), // Placeholders
            options: step.options || [],
            carousel: step.carousel || []
          };
          return [...newMessages, newMessage];
        });
      }

      if (step.awaitInput) {
        setAwaitingInput(true);
        setInputCallbackStep(step.awaitInput);
      } else {
        setAwaitingInput(false);
        setInputCallbackStep(null);
      }

      if (step.nextStep) {
        setTimeout(() => showStep(step.nextStep), 1000);
      }
    };
    
    if (step.message) {
      addMessageToChat('bot', <TypingIndicator />);
      setTimeout(showBotMessage, 750);
    } else {
      showBotMessage();
    }
  };
  
  const handleUserSelection = (nextStep, text) => {
    addMessageToChat('user', text);
    showStep(nextStep);
  };

  const handleTextInput = (text) => {
    if (!text.trim()) return;

    addMessageToChat('user', text);
    setInputText(''); 

    if (isAwaitingInput && inputCallbackStep) {
      showStep(inputCallbackStep);
    } else {
      showStep('fallback_prompt');
    }
  };
  
  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      const startStep = userRole === 'cliente' ? 'menu_cliente' : 'menu_gerente';
      showStep(startStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatOpen]);

  // --- Lógica de Interacción Dashboard -> Chat ---
  const handleChartClick = (e, chartId, title, summary) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnalysisModal({
      visible: true, title, summary,
      nextStep: `analisis_${chartId}`,
      x: e.clientX, y: rect.top - 10
    });
  };

  const handleAnalysisClick = () => {
    setAnalysisModal(prev => ({ ...prev, visible: false }));
    setChatOpen(true);
    showStep(analysisModal.nextStep);
  };
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (analysisModal.visible && !e.target.closest('.analysis-pop-up')) {
        setAnalysisModal(prev => ({ ...prev, visible: false }));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [analysisModal.visible]);


  return (
    <div className="dashboard-view">
      <Sidebar onLogout={onLogout} /> 
      <Header onSettingsClick={() => setCurrentModal('settings')} />
      
      <main id="dashboard-main">
        {userRole === 'cliente' && <ClientDashboard onChartClick={handleChartClick} />}
        {userRole === 'admin' && <AdminDashboard onChartClick={handleChartClick} />}
      </main>

      <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setChatOpen(!isChatOpen)}
        messages={chatMessages}
        onUserSelection={handleUserSelection}
        onTextInput={handleTextInput}
        inputText={inputText}
        setInputText={setInputText}
        isAwaitingInput={isAwaitingInput}
      />
      
      <Modals
        currentModal={currentModal}
        onClose={() => setCurrentModal(null)}
        onSecurityClick={() => {
          setCurrentModal(null);
          setChatOpen(true);
          showStep('info_sensible');
        }}
      />

      {analysisModal.visible && (
        <AnalysisModal
          {...analysisModal}
          onClick={handleAnalysisClick}
        />
      )}
    </div>
  );
}

// --- Componentes del Dashboard ---

function Sidebar({ onLogout }) { 
  return (
    <aside id="dashboard-sidebar">
      <div>
        <div className="logo">Academium</div>
        <nav>
          <a href="#" className="active"><Home size={20} /> Inicio</a>
          <a href="#"><FileText size={20} /> Facturas</a>
          <a href="#"><DollarSign size={20} /> Pagos</a>
          <a href="#"><BarChart2 size={20} /> Reportes</a>
          <a href="#"><Users size={20} /> Estudiantes</a>
        </nav>
      </div>
      <div className="sidebar-footer">
        <button onClick={onLogout}>
          <LogOut size={20} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

function Header({ onSettingsClick }) {
  return (
    <header id="dashboard-header" className="dashboard-header">
      <div className="header-icon"><Bell size={20} /></div>
      <div className="header-icon" onClick={onSettingsClick}><Settings size={20} /></div>
    </header>
  );
}

function ClientDashboard({ onChartClick }) {
  return (
    <div className="dashboard-content">
      <h2>Hola, {'{Nombre_Cliente}'}</h2> 
      
      <div className="dashboard-grid">
        <KpiCard title="Deuda Pendiente" value="$ 50.00" label="Vence en 2 días" type="negative" />
        <KpiCard title="Última Factura Pagada" value="$ 250.00" label="Pagada el 01/Nov" type="positive" />
        <KpiCard title="Próximo Pago" value="01 de Diciembre" label="Pensión" type="warning" />
      </div>

      <h2 style={{ marginTop: '20px' }}>Análisis Gráfico</h2>

      <div className="dashboard-grid client-charts">
        <div className="dash-card">
          <h3>Gastos por Categoría (Año)</h3>
          <div 
            className="chart-container" 
            onClick={(e) => onChartClick(e, 'cliente_pie', 'Gastos por Categoría', "La <strong>Pensión (70%)</strong> es tu gasto principal. Haz clic para ver el detalle de 'Otros'.")}
          >
            <Pie data={chartData.clientPie.data} options={chartData.clientPie.options} />
          </div>
        </div>
        <div className="dash-card">
          <h3>Historial de Pagos (Últ. 6 Meses)</h3>
          <div 
            className="chart-container" 
            onClick={(e) => onChartClick(e, 'cliente_bar', 'Historial de Pagos', "Detectamos un <strong class='negative'>pago duplicado en Septiembre</strong>. Haz clic para reportarlo.")}
          >
            <Bar data={chartData.clientBar.data} options={chartData.clientBar.options} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ onChartClick }) {
  return (
    <div className="dashboard-content">
      <h2>Dashboard Administrativo</h2>
      
      <div className="dashboard-grid">
        <KpiCard title="Recaudación (Hoy)" value="$ 8,530.00" type="positive" />
        <KpiCard title="Facturas Pagadas (Hoy)" value="52" />
        <KpiCard title="Cartera Vencida" value="$ 4,250.00" type="negative" />
        <KpiCard title="Tasa de Morosidad" value="12.5%" type="negative" />
      </div>

      <h2 style={{ marginTop: '20px' }}>Análisis Gráfico</h2>

      <div className="dashboard-grid admin-charts">
        <div className="dash-card">
          <h3>Recaudación Últimos 7 Días</h3>
          <div 
            className="chart-container"
            onClick={(e) => onChartClick(e, 'admin_bar', 'Tendencia de Recaudación', "Se observa un <strong class='positive'>pico de pagos los días Lunes</strong>. Los Jueves son los días más bajos. ¿Analizamos los métodos de pago?")}
          >
            <Bar data={chartData.adminBar.data} options={chartData.adminBar.options} />
          </div>
        </div>
        <div className="dash-card">
          <h3>Métodos de Pago (Últ. 30 días)</h3>
          <div 
            className="chart-container"
            onClick={(e) => onChartClick(e, 'admin_pie', 'Análisis de Pagos', "<strong class='negative'>El 45% de pagos sigue siendo en Efectivo/Ventanilla</strong>, lo cual es costoso de procesar. ¿Desea ver el análisis estadístico de pagos con tarjeta?")}
          >
            <Pie data={chartData.adminPie.data} options={chartData.adminPie.options} />
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, label, type = '' }) {
  const valueClass = `value ${type}`;
  return (
    <div className="dash-card kpi-card">
      <h3>{title}</h3>
      <p className={valueClass}>{value}</p>
      {label && <p className="label">{label}</p>}
    </div>
  );
}

// --- Componentes del Chat ---

function ChatWidget({ 
  isOpen, onToggle, messages, onUserSelection,
  onTextInput, inputText, setInputText, isAwaitingInput 
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendClick = () => {
    onTextInput(inputText);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  };

  return (
    <>
      <button id="chat-toggle-button" className="chat-toggle-button" onClick={onToggle}>
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      <div id="chat-widget" className={`chat-widget ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <h3>Asistente Academium</h3>
          <button onClick={onToggle}><X size={18} /></button>
        </div>
        <div className="chat-messages">
          {messages.map((msg) => (
            <Message key={msg.id} {...msg} onUserSelection={onUserSelection} />
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-input-area">
          <input 
            type="text" 
            placeholder={isAwaitingInput ? "Escribe tu respuesta..." : "Escribe un mensaje..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSendClick} disabled={!inputText.trim()}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </>
  );
}

function Message({ sender, content, options, carousel, onUserSelection }) {
  if (typeof content !== 'string') {
    return <div className="message bot">{content}</div>;
  }
  
  const handleOptionClick = (e) => {
    const nextStep = e.target.dataset.nextStep;
    const text = e.target.textContent;
    const parent = e.target.parentElement;
    parent.querySelectorAll('.option-button').forEach(btn => {
      btn.disabled = true;
      btn.classList.add('disabled');
    });
    if (onUserSelection) {
      onUserSelection(nextStep, text);
    }
  };
  
  return (
    <div className={`message ${sender}`}>
      <span dangerouslySetInnerHTML={{ __html: content }} />
      {carousel && carousel.length > 0 && <Carousel items={carousel} />}
      {options && options.length > 0 && (
        <div className="message-options">
          {options.map((opt, index) => (
            <button
              key={index}
              className="option-button"
              data-next-step={opt.nextStep}
              onClick={handleOptionClick}
            >
              {opt.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

function Carousel({ items }) {
  const [index, setIndex] = useState(0);

  const canGoPrev = index > 0;
  const canGoNext = index < items.length - 1;

  const next = () => canGoNext && setIndex(i => i + 1);
  const prev = () => canGoPrev && setIndex(i => i - 1);

  return (
    <div className="carousel">
      <div className="carousel-inner" style={{ transform: `translateX(-${index * 100}%)` }}>
        {items.map((item, i) => (
          <div className="carousel-item" key={i}>
            <h4>{item.title}</h4>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
      <div className="carousel-nav">
        <button onClick={prev} disabled={!canGoPrev}><ChevronLeft size={14} /></button>
        <button onClick={next} disabled={!canGoNext}><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}


// --- Componentes de Modales ---

function Modals({ currentModal, onClose, onSecurityClick }) {
  if (!currentModal) return null;

  return (
    <>
      {currentModal === 'settings' && (
        <SettingsModal onClose={onClose} onSecurityClick={onSecurityClick} />
      )}
    </>
  );
}

function Modal({ children, onClose, modalId }) {
  const handleContentClick = (e) => e.stopPropagation();
  return (
    <div id={modalId} className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        {children}
      </div>
    </div>
  );
}

// --- MODAL DE CONFIGURACIÓN (REDISEÑADO) ---
function SettingsModal({ onClose, onSecurityClick }) {
  const [canal, setCanal] = useState('email');
  const [motorIA, setMotorIA] = useState('estable');
  const [proactividad, setProactividad] = useState('reactivo');
  const [densidad, setDensidad] = useState(false); // false = Simplificado

  return (
    <Modal onClose={onClose} modalId="settings-modal">
      <div className="modal-header">
        <h3>Configuración y Fiabilidad</h3>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
      <div className="modal-body">

        <div className="form-group">
          <label>Motor de IA (Fiabilidad)</label>
          <p className="description">Elige el modelo para análisis y respuestas.</p>
          <div className="segmented-control">
            <button className={motorIA === 'estable' ? 'active' : ''} onClick={() => setMotorIA('estable')}>
              <UserCheck size={16} style={{marginRight: '8px'}}/> Estable (v2.4)
            </button>
            <button className={motorIA === 'avanzado' ? 'active' : ''} onClick={() => setMotorIA('avanzado')}>
              <TrendingUp size={16} style={{marginRight: '8px'}}/> Avanzado (v3.0)
            </button>
            <button className={motorIA === 'experimental' ? 'active' : ''} onClick={() => setMotorIA('experimental')}>
              <Zap size={16} style={{marginRight: '8px'}}/> Experimental (Gemini)
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Nivel de Proactividad del Asistente</label>
          <p className="description">Elige si el bot debe enviarte alertas o solo responder.</p>
          <div className="segmented-control">
            <button className={proactividad === 'reactivo' ? 'active' : ''} onClick={() => setProactividad('reactivo')}>
              <BellOff size={16} style={{marginRight: '8px'}}/> Reactivo
            </button>
            <button className={proactividad === 'proactivo' ? 'active' : ''} onClick={() => setProactividad('proactivo')}>
              <Bell size={16} style={{marginRight: '8px'}}/> Proactivo
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Densidad de Resúmenes</label>
          <p className="description">Muestra resúmenes simplificados o con todo el detalle técnico.</p>
          <label className="switch">
            <input type="checkbox" checked={densidad} onChange={() => setDensidad(!densidad)} />
            <span className="slider"></span>
          </label>
          <span style={{marginLeft: '10px', verticalAlign: 'middle'}}>{densidad ? 'Detallado' : 'Simplificado'}</span>
        </div>
        
        <div className="form-group">
          <label>Canal de Notificación Preferido</label>
          <div className="segmented-control">
            <button className={canal === 'email' ? 'active' : ''} onClick={() => setCanal('email')}>
              <Mail size={16} style={{marginRight: '8px'}}/> Email
            </button>
            <button className={canal === 'whatsapp' ? 'active' : ''} onClick={() => setCanal('whatsapp')}>
              <MessageCircle size={16} style={{marginRight: '8px'}}/> WhatsApp
            </button>
          </div>
        </div>

        <div className="form-group" style={{marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px'}}>
          <label>Modo de Alta Seguridad</label>
          <p className="description">Prueba el flujo de confirmación para acceder a datos sensibles.</p>
          <button className="option-button" onClick={onSecurityClick} style={{width: '100%', textAlign: 'center', justifyContent: 'center'}}>
            <AlertTriangle size={16} style={{marginRight: '8px'}} />
            Probar Flujo de Seguridad
          </button>
        </div>

      </div>
    </Modal>
  );
}

function AnalysisModal({ title, summary, onClick, x, y }) {
  const style = {
    left: `${x}px`,
    top: `${y}px`,
    transform: x > (window.innerWidth - 320) ? 'translateX(-100%)' : 'translateX(0)',
  };
  return (
    <div 
      className="analysis-pop-up" 
      style={style} 
      onClick={onClick}
    >
      <h4>{title}</h4>
      <p dangerouslySetInnerHTML={{ __html: summary }} />
      <span>Clic para analizar en el chat...</span>
    </div>
  );
}

export default App;