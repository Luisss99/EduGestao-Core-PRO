'use client';

import React, { useState } from 'react';
import { School, Lock, Mail, ArrowRight, ShieldCheck, X, FileText, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalType, setModalType] = useState<'termos' | 'privacidade' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!email || !password) {
      setServerError('Preencha seu e-mail e senha.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // Redirecionamento completo do navegador para o Dashboard
        window.location.replace('/dashboard');
      } else {
        setLoading(false);
        setServerError(result.error || 'E-mail ou senha incorretos.');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setServerError('Falha de conexão com o servidor. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-md rounded-3xl border border-indigo-900/50 bg-slate-900/80 backdrop-blur-xl text-white p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
            <School className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">EduSaaS Portal</h1>
          <p className="text-xs text-indigo-200">
            Acesse o sistema de gestão escolar
          </p>
        </div>

        {serverError && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs font-semibold text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold mb-1 text-slate-300">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-10 rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-3 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-300">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 rounded-xl border border-slate-700 bg-slate-800/80 pl-9 pr-3 text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Verificando credenciais...
              </>
            ) : (
              <>
                Entrar no Sistema <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Rodapé com Termos de Uso, Política de Privacidade e LGPD */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-indigo-300">
            <button
              type="button"
              onClick={() => setModalType('termos')}
              className="hover:underline hover:text-white transition-colors cursor-pointer"
            >
              Termos de Uso
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={() => setModalType('privacidade')}
              className="hover:underline hover:text-white transition-colors cursor-pointer"
            >
              Política de Privacidade
            </button>
          </div>

          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Em conformidade com a LGPD (Lei nº 13.709/2018).</span>
          </p>
        </div>
      </div>

      {/* Modal de Termos de Uso e Política de Privacidade */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 shadow-2xl p-6 transition-all my-8 max-h-[85vh] overflow-y-auto space-y-4 text-xs leading-relaxed">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <FileText className="h-4 w-4 text-indigo-400" />
                {modalType === 'termos' ? 'Termos de Uso do Sistema' : 'Política de Privacidade e LGPD'}
              </div>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalType === 'termos' ? (
              <div className="space-y-3 text-slate-300">
                <p>
                  <strong>1. Aceitação dos Termos:</strong> Ao acessar e utilizar o portal escolar EduSaaS, o usuário declara concordar com as regras operacionais, sigilo acadêmico e condições de uso do sistema.
                </p>
                <p>
                  <strong>2. Acesso e Credenciais:</strong> O acesso é pessoal, nominal e intransferível. O titular da conta é responsável pela guarda de sua senha e por todas as atividades registradas sob sua credencial.
                </p>
                <p>
                  <strong>3. Uso Adequado:</strong> É expressamente vedado o compartilhamento indevido de dados pedagógicos, notas ou cadastros de alunos com terceiros não autorizados.
                </p>
                <p>
                  <strong>4. Responsabilidade Administrativa:</strong> Os lançamentos de notas, faltas e dados financeiros possuem valor acadêmico oficial no âmbito da instituição escolar.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-slate-300">
                <p>
                  <strong>1. Tratamento e Finalidade (LGPD Art. 7º):</strong> Os dados pessoais de alunos, professores e responsáveis são coletados estritamente para fins de prestação de serviços educacionais, gestão de matrículas, emissão de boletins e cumprimento de deveres legais regulatórios.
                </p>
                <p>
                  <strong>2. Segurança e Criptografia:</strong> Empregamos padrões de segurança física e digital, incluindo hashes criptográficos para senhas e controle rigoroso de privilégios de acesso.
                </p>
                <p>
                  <strong>3. Direitos do Titular (LGPD Art. 18):</strong> O titular ou seu representante legal pode solicitar a confirmação da existência de tratamento, correção de dados incompletos ou atualização cadastral junto à secretaria.
                </p>
                <p>
                  <strong>4. Compartilhamento Restrito:</strong> Os dados acadêmicos nunca serão comercializados nem cedidos para finalidades estranhas à atividade escolar.
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="h-8 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Entendi e Concordo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
