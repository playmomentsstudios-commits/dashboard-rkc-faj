import { useState } from 'react';
import type { ReactNode } from 'react';
import { LayoutDashboard, TrendingUp, ClipboardList, FileText, Receipt, ChevronDown, ChevronRight, Menu, X, ShieldCheck } from 'lucide-react';
import fajLogo from '../../imports/FAJ-Azul.png';
import kaluLogo from '../../imports/logo_negativa_RKC.png';
import { useAppConfig } from '../../contexts/AppConfigContext';

export type Page = 'dashboard' | 'financeiro' | 'plano' | 'relatorios' | 'prestacao' | 'admin';

interface SidebarProps {
  current: Page;
  onChange: (p: Page) => void;
  financTab: string;
  setFinancTab: (t: string) => void;
  planoTab: string;
  setPlanoTab: (t: string) => void;
}

export function Sidebar({ current, onChange, financTab, setFinancTab, planoTab, setPlanoTab }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [financOpen, setFinancOpen] = useState(true);
  const [planoOpen, setPlanoOpen] = useState(false);
  const { logos } = useAppConfig();
  const fajLogoSrc = logos.faj?.public_url ?? fajLogo;
  const kalungaLogoSrc = logos.kalunga?.public_url ?? kaluLogo;

  const nav = (icon: ReactNode, label: string, page: Page, hasChildren?: boolean, isOpen?: boolean, onToggle?: () => void) => {
    const active = current === page;
    return (
      <button
        onClick={() => { onChange(page); onToggle?.(); setMobileOpen(false); }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active ? 'bg-white/20 text-white font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
      >
        <span className="shrink-0 w-[18px]">{icon}</span>
        {!collapsed && <span className="flex-1 text-left">{label}</span>}
        {!collapsed && hasChildren && (
          <span className="text-white/40 ml-auto">
            {isOpen ? <ChevronDown size={13}/> : <ChevronRight size={13}/>}
          </span>
        )}
      </button>
    );
  };

  const sub = (label: string, tab: string, isFinanc: boolean) => {
    const active = isFinanc ? financTab === tab : planoTab === tab;
    return (
      <button
        key={tab}
        onClick={() => { isFinanc ? setFinancTab(tab) : setPlanoTab(tab); onChange(isFinanc ? 'financeiro' : 'plano'); setMobileOpen(false); }}
        className={`w-full text-left pl-10 pr-3 py-2 rounded-lg text-xs transition-all ${active ? 'bg-white/20 text-white font-semibold' : 'text-white/55 hover:bg-white/10 hover:text-white'}`}
      >
        {label}
      </button>
    );
  };

  const content = (
    <div className="flex flex-col h-full min-h-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 shrink-0">
        {!collapsed && (
          <div className="space-y-1.5">
            <img src={fajLogoSrc} alt="FAJ" className="h-7 object-contain brightness-0 invert" />
          </div>
        )}
        <button onClick={() => setCollapsed(v => !v)} className="text-white/60 hover:text-white p-1 rounded ml-auto">
          <Menu size={17} />
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-white/10 shrink-0">
          <img src={kalungaLogoSrc} alt="Rede Kalunga" className="h-6 object-contain opacity-90" />
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {nav(<LayoutDashboard size={17}/>, 'Dashboard', 'dashboard')}

        {nav(<TrendingUp size={17}/>, 'Financeiro', 'financeiro', true, financOpen, () => setFinancOpen(v => !v))}
        {!collapsed && financOpen && (
          <div className="mb-1">
            {sub('Resumo Financeiro', 'resumo', true)}
            {sub('Rubricas', 'rubricas', true)}
            {sub('Comparativo Mensal', 'comparativo', true)}
          </div>
        )}

        {nav(<Receipt size={17}/>, 'Prestação de Contas', 'prestacao')}

        {nav(<ClipboardList size={17}/>, 'Plano de Trabalho', 'plano', true, planoOpen, () => setPlanoOpen(v => !v))}
        {!collapsed && planoOpen && (
          <div className="mb-1">
            {sub('Atividades', 'atividades', false)}
            {sub('Execução', 'execucao', false)}
            {sub('Relatórios', 'relatorios', false)}
          </div>
        )}

        {nav(<FileText size={17}/>, 'Relatórios', 'relatorios')}
        {nav(<ShieldCheck size={17}/>, 'Admin', 'admin')}
      </nav>

      {!collapsed && (
        <div className="px-4 py-4 border-t border-white/10 shrink-0">
          <p className="text-xs text-white/35 text-center">PC Financeira 2026.1</p>
          <p className="text-xs text-white/25 text-center mt-0.5">Dez/25 – Mai/26</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 ${collapsed ? 'w-14' : 'w-60'}`}
        style={{ background: 'linear-gradient(170deg, #0A3880 0%, #0D47A1 40%, #1565C0 100%)', minHeight: '100vh' }}
      >
        {content}
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 shadow-lg" style={{ background: '#0D47A1' }}>
        <img src={fajLogoSrc} alt="FAJ" className="h-7 object-contain brightness-0 invert" />
        <button onClick={() => setMobileOpen(v => !v)} className="text-white p-1.5">
          {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 pt-14 overflow-y-auto" style={{ background: 'linear-gradient(170deg, #0A3880 0%, #0D47A1 50%, #1565C0 100%)' }}>
          <div className="py-4">{content}</div>
        </div>
      )}
    </>
  );
}
