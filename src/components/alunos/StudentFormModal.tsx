'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema } from '@/lib/validators/schemas';
import { createStudent, updateStudent } from '@/app/actions/students';
import { X, Loader2, UserPlus, UserCheck, MapPin, CreditCard } from 'lucide-react';
import { formatCPFDisplay } from '@/lib/utils';

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentToEdit?: any | null;
}

export function StudentFormModal({
  isOpen,
  onClose,
  onSuccess,
  studentToEdit,
}: StudentFormModalProps) {
  const [loadingCep, setLoadingCep] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const isEditing = !!studentToEdit;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullName: '',
      cpf: '',
      email: '',
      phone: '',
      birthDate: '',
      zipCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    },
  });

  useEffect(() => {
    if (studentToEdit) {
      const formattedDate = studentToEdit.birthDate
        ? new Date(studentToEdit.birthDate).toISOString().split('T')[0]
        : '';

      reset({
        fullName: studentToEdit.fullName || '',
        cpf: formatCPFDisplay(studentToEdit.cpf || ''),
        email: studentToEdit.email || '',
        phone: studentToEdit.phone || '',
        birthDate: formattedDate,
        zipCode: studentToEdit.zipCode || '',
        street: studentToEdit.street || '',
        number: studentToEdit.number || '',
        complement: studentToEdit.complement || '',
        neighborhood: studentToEdit.neighborhood || '',
        city: studentToEdit.city || '',
        state: studentToEdit.state || '',
      });
    } else {
      reset({
        fullName: '',
        cpf: '',
        email: '',
        phone: '',
        birthDate: '',
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      });
    }
  }, [studentToEdit, reset]);

  if (!isOpen) return null;

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`/api/viacep/${cep}`);
        if (res.ok) {
          const data = await res.json();
          setValue('street', data.street || '');
          setValue('neighborhood', data.neighborhood || '');
          setValue('city', data.city || '');
          setValue('state', data.state || '');
        }
      } catch (err) {
        console.error('Erro na consulta ViaCEP:', err);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const onSubmit = async (data: any) => {
    setServerError(null);
    let res;
    if (isEditing) {
      res = await updateStudent(studentToEdit.id, data);
    } else {
      res = await createStudent(data);
    }

    if (res.success) {
      reset();
      onSuccess();
      onClose();
    } else {
      setServerError(res.error || 'Erro ao processar dados cadastrais.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border bg-card text-card-foreground shadow-2xl p-6 transition-all my-8 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <UserCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <UserPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            )}
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {isEditing ? 'Editar Ficha do Aluno' : 'Cadastrar Novo Aluno'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isEditing
                  ? 'Atualize os dados pessoais e residenciais do aluno.'
                  : 'Preencha os campos obrigatórios para gerar o cadastro.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Dados Pessoais */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1">
              <CreditCard className="h-3.5 w-3.5" /> Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nome Completo *</label>
                <input
                  {...register('fullName')}
                  placeholder="Ex: Lucas Fernandes Silva"
                  className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
                {errors.fullName && (
                  <p className="text-destructive text-[11px] mt-0.5">{errors.fullName.message as string}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">CPF (apenas números ou formatado) *</label>
                <input
                  {...register('cpf')}
                  placeholder="000.000.000-00"
                  className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
                {errors.cpf && (
                  <p className="text-destructive text-[11px] mt-0.5">{errors.cpf.message as string}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">E-mail *</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="aluno@email.com"
                  className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
                {errors.email && (
                  <p className="text-destructive text-[11px] mt-0.5">{errors.email.message as string}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Telefone / WhatsApp *</label>
                <input
                  {...register('phone')}
                  placeholder="(11) 99999-9999"
                  className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
                {errors.phone && (
                  <p className="text-destructive text-[11px] mt-0.5">{errors.phone.message as string}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">Data de Nascimento *</label>
                <input
                  {...register('birthDate')}
                  type="date"
                  className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
                {errors.birthDate && (
                  <p className="text-destructive text-[11px] mt-0.5">{errors.birthDate.message as string}</p>
                )}
              </div>
            </div>
          </div>

          {/* Endereço com Busca Automática CEP */}
          <div className="border-t pt-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Endereço Residencial (Autopreenchimento por CEP)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">CEP *</label>
                <div className="relative">
                  <input
                    {...register('zipCode')}
                    onBlur={handleCepBlur}
                    placeholder="00000-000"
                    className="w-full h-9 rounded-lg border bg-background px-3 pr-8 focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                  {loadingCep && (
                    <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-indigo-600" />
                  )}
                </div>
                {errors.zipCode && (
                  <p className="text-destructive text-[11px] mt-0.5">{errors.zipCode.message as string}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">Logradouro / Rua *</label>
                <input
                  {...register('street')}
                  placeholder="Rua, Avenida..."
                  className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
                {errors.street && (
                  <p className="text-destructive text-[11px] mt-0.5">{errors.street.message as string}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Número *</label>
                <input
                  {...register('number')}
                  placeholder="123"
                  className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
                {errors.number && (
                  <p className="text-destructive text-[11px] mt-0.5">{errors.number.message as string}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Complemento</label>
                <input
                  {...register('complement')}
                  placeholder="Apto 42, Bloco B"
                  className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Bairro *</label>
                <input
                  {...register('neighborhood')}
                  placeholder="Bairro"
                  className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
                {errors.neighborhood && (
                  <p className="text-destructive text-[11px] mt-0.5">{errors.neighborhood.message as string}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Cidade *</label>
                <input
                  {...register('city')}
                  placeholder="Cidade"
                  className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 text-xs"
                />
                {errors.city && (
                  <p className="text-destructive text-[11px] mt-0.5">{errors.city.message as string}</p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Estado (UF) *</label>
                <input
                  {...register('state')}
                  placeholder="SP"
                  maxLength={2}
                  className="w-full h-9 rounded-lg border bg-background px-3 focus:ring-2 focus:ring-indigo-500 text-xs uppercase"
                />
                {errors.state && (
                  <p className="text-destructive text-[11px] mt-0.5">{errors.state.message as string}</p>
                )}
              </div>
            </div>
          </div>

          {/* Aviso de Conformidade LGPD */}
          <div className="p-2.5 rounded-lg bg-muted/40 border text-[11px] text-muted-foreground flex items-center gap-2">
            <span className="font-semibold text-foreground">🔒 LGPD:</span>
            <span>Os dados pessoais coletados destinam-se exclusivamente à gestão escolar, emissão de documentos acadêmicos e obrigações educacionais.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg border bg-background hover:bg-accent text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : isEditing ? (
                'Salvar Alterações'
              ) : (
                'Cadastrar Aluno'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
