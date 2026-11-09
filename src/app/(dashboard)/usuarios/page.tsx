'use client';

import React, { useEffect, useState } from 'react';
import { UserCheck, Shield, Plus, Trash2, Loader2, X, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { getUsers, createUser, deleteUser, getSessionUser } from '@/app/actions/auth';
import { formatDate } from '@/lib/utils';

export default function UsuariosPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'SECRETARY'>('SECRETARY');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [usersRes, sessionRes] = await Promise.all([
      getUsers(),
      getSessionUser(),
    ]);

    if (usersRes.success) {
      setUsers(usersRes.data || []);
    }
    if (sessionRes) {
      setCurrentUser(sessionRes);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const isAdmin = currentUser?.role === 'ADMIN';

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    const res = await createUser({
      name,
      email,
      password,
      role,
    });

    setSubmitting(false);

    if (res.success) {
      setName('');
      setEmail('');
      setPassword('');
      setRole('SECRETARY');
      setIsModalOpen(false);
      loadData();
    } else {
      setErrorMsg(res.error || 'Erro ao criar usuário.');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`Tem certeza que deseja remover o usuário ${userName}? Ele não poderá mais acessar o sistema.`)) {
      const res = await deleteUser(userId);
      if (res.success) {
        loadData();
      } else {
        alert(res.error || 'Erro ao remover usuário.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold text-foreground">Gestão de Usuários & Acessos</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cadastre os membros da equipe administrativa com e-mail e senha individuais.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Novo Usuário
          </button>
        )}
      </div>

      {!isAdmin && !loading && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Você está conectado como <strong>{currentUser?.name || 'Secretaria'}</strong>. Apenas usuários com perfil de <strong>Administrador</strong> têm permissão para adicionar ou remover contas.
          </span>
        </div>
      )}

      {/* Tabela de Usuários */}
      <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-xs">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b bg-muted/30 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Nome do Usuário</th>
                  <th className="py-2.5 px-3">E-mail de Acesso</th>
                  <th className="py-2.5 px-3 text-center">Nível de Permissão</th>
                  <th className="py-2.5 px-3">Criado em</th>
                  {isAdmin && <th className="py-2.5 px-3 text-right">Ação</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">{u.name}</div>
                      {u.id === currentUser?.id && (
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                          (Você está conectado aqui)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground">{u.email}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        {u.role === 'ADMIN' ? 'Administrador' : 'Secretaria'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
                    {isAdmin && (
                      <td className="py-3 px-3 text-right">
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-1.5 rounded-lg border bg-background hover:bg-destructive/10 text-destructive transition-colors cursor-pointer"
                            title="Excluir Usuário"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Adicionar Novo Usuário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl border bg-card text-card-foreground shadow-2xl p-6 transition-all my-8">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-600" />
                <h2 className="text-base font-bold text-foreground">Novo Usuário do Sistema</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-foreground">Nome Completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Roberto Silva"
                    required
                    className="w-full h-9 rounded-lg border bg-background pl-9 pr-3 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-foreground">E-mail para Login *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@escola.com.br"
                    required
                    className="w-full h-9 rounded-lg border bg-background pl-9 pr-3 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-foreground">Senha de Acesso *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                    minLength={6}
                    className="w-full h-9 rounded-lg border bg-background pl-9 pr-3 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-foreground">Perfil de Acesso (Cargo) *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full h-9 rounded-lg border bg-background px-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="SECRETARY">Secretaria / Atendimento (Acesso operacional)</option>
                  <option value="ADMIN">Administrador (Controle total do sistema)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 px-3 rounded-lg border bg-background hover:bg-accent text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-8 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Salvando...
                    </>
                  ) : (
                    'Criar Usuário'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
