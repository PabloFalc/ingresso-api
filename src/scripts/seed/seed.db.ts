import { db } from 'src/infra/database/drizzle-client';
import {
  criarEvento,
  criarTipoIngresso,
  criarUsuarioSeed,
  type SeedEventoInput,
  type SeedTipoIngressoInput,
} from './seed.helpers';

const MAX_REGISTROS = 100;
const EVENTOS_TOTAL = 20;

const USUARIO_SEED = {
  name: 'seed',
  email: 'seed@seed.com',
  cpf: '01234567890',
  password: '12345678',
};

const TIPOS_BASE = [
  {
    nome: 'Pista',
    preco: 5000,
    quantidadeTotal: 120,
    ativo: true,
  },
  {
    nome: 'VIP',
    preco: 15000,
    quantidadeTotal: 40,
    ativo: true,
  },
  {
    nome: 'Camarote',
    preco: 30000,
    quantidadeTotal: 15,
    ativo: true,
  },
] as const;

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function addHours(date: Date, hours: number) {
  const copy = new Date(date);
  copy.setHours(copy.getHours() + hours);
  return copy;
}

function iso(date: Date) {
  return date.toISOString();
}

function criarEventoSeed(
  index: number,
  organizadorId: string,
): SeedEventoInput {
  const now = new Date();
  const dataInicio = addDays(now, 20 + index * 2);
  const dataFim = addHours(dataInicio, 4 + (index % 3));
  const numero = String(index + 1).padStart(2, '0');

  return {
    titulo: `Evento Seed ${numero}`,
    descricao: `Evento gerado pelo script de seed para testes e desenvolvimento. Lote ${numero}.`,
    dataInicio: iso(dataInicio),
    dataFim: iso(dataFim),
    status: 'PUBLICADO',
    local: `Espaco Seed ${numero}`,
    organizadorId,
  };
}

function criarTiposIngressoSeed(
  eventoId: string,
  eventoIndex: number,
): SeedTipoIngressoInput[] {
  const now = new Date();
  const inicioVenda = addDays(now, -5);
  const fimVenda = addDays(now, 14 + eventoIndex * 2);

  return TIPOS_BASE.map((tipo, tipoIndex) => ({
    eventoId,
    nome: `${tipo.nome} Seed`,
    preco: tipo.preco + eventoIndex * 250 + tipoIndex * 100,
    quantidadeTotal: tipo.quantidadeTotal,
    quantidadeVendida: 0,
    inicioVenda: iso(inicioVenda),
    fimVenda: iso(fimVenda),
    ativo: tipo.ativo,
  }));
}

async function seed() {
  const totalRegistros =
    1 + 1 + EVENTOS_TOTAL + EVENTOS_TOTAL * TIPOS_BASE.length;

  if (totalRegistros > MAX_REGISTROS) {
    throw new Error(
      `O seed tentaria criar ${totalRegistros} registros, acima do limite de ${MAX_REGISTROS}.`,
    );
  }

  const usuario = await criarUsuarioSeed(USUARIO_SEED);
  let eventosCriados = 0;
  let tiposCriados = 0;

  for (let index = 0; index < EVENTOS_TOTAL; index += 1) {
    const evento = await criarEvento(criarEventoSeed(index, usuario.id));
    eventosCriados += 1;

    const tipos = criarTiposIngressoSeed(evento.id, index);

    for (const tipo of tipos) {
      await criarTipoIngresso(tipo);
      tiposCriados += 1;
    }
  }

  console.info('Seed finalizado com sucesso.');
  console.table({
    usuario: usuario.email,
    senha: '12345678',
    eventos: eventosCriados,
    tiposIngresso: tiposCriados,
  });
}

seed()
  .catch((error: unknown) => {
    console.error('Erro ao executar seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$client.end();
  });
