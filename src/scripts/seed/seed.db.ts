import { db } from 'src/infra/database/drizzle-client';
import {
  criarEvento,
  criarTipoIngresso,
  criarUsuarioSeed,
  type SeedEventoInput,
  type SeedTipoIngressoInput,
} from './seed.helpers';

const MAX_REGISTROS = 100;

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

const EVENTOS_MOCK = [
  {
    titulo: 'Deftones - White Pony Night',
    descricao:
      'Show mock de nu metal e shoegaze pesado inspirado na fase White Pony.',
    local: 'Arena Diamond Eyes',
  },
  {
    titulo: 'Slipknot - Iowa Masked Fest',
    descricao:
      'Festival mock com palco pesado, mascaras, riffs secos e energia caotica.',
    local: 'Galpao Nine',
  },
  {
    titulo: 'Kendrick Lamar - DAMN. Live Experience',
    descricao:
      'Experiencia mock de rap com set conceitual, luz baixa e narrativa de palco.',
    local: 'Teatro Compton',
  },
  {
    titulo: 'Travis Scott - Utopia Arena',
    descricao:
      'Show mock de hip-hop com atmosfera futurista, graves fortes e palco imersivo.',
    local: 'Arena Utopia',
  },
  {
    titulo: 'Kanye West - Graduation Listening Party',
    descricao:
      'Evento mock inspirado em rap, samples, sintetizadores e clima de listening party.',
    local: 'Dome Graduation',
  },
  {
    titulo: 'Linkin Park - Hybrid Theory Tribute',
    descricao:
      'Tributo mock de nu metal com rap rock, guitarras abertas e refracoes de arena.',
    local: 'Espaco Meteora',
  },
  {
    titulo: 'Korn - Follow the Leader Night',
    descricao:
      'Noite mock dedicada ao groove pesado, baixo estalado e classicos do nu metal.',
    local: 'Subsolo Bakersfield',
  },
  {
    titulo: 'Limp Bizkit - Break Stuff Sessions',
    descricao:
      'Evento mock de rap metal com riffs explosivos e energia de pista lotada.',
    local: 'Warehouse Chocolate Starfish',
  },
  {
    titulo: 'System of a Down - Toxicity Stage',
    descricao:
      'Show mock com metal alternativo, viradas quebradas e coro alto do publico.',
    local: 'Arena Toxicity',
  },
  {
    titulo: 'BTS - Seoul Pop Lights',
    descricao:
      'Evento mock de kpop com coreografias, lightsticks e producao de grande arena.',
    local: 'Seoul Light Hall',
  },
  {
    titulo: 'BLACKPINK - Pink Venom Party',
    descricao:
      'Festa mock de kpop com pop explosivo, performance visual e pista premium.',
    local: 'Pink Stage',
  },
  {
    titulo: 'Michael Jackson return',
    descricao:
      'Isso mesmo, cara "voltou" dos mortos para fazer um show no infeno que se chama TERESINA',
    local: 'Teresina - Aculá',
  },
  {
    titulo: 'aespa - Cyber K-pop Night',
    descricao:
      'Evento mock com estetica cyber, kpop eletronico e palco cheio de LEDs.',
    local: 'KWANGYA Hall',
  },
  {
    titulo: 'Stray Kids - Thunderous Showcase',
    descricao:
      'Showcase mock de kpop com rap rapido, coreografia forte e beats agressivos.',
    local: 'District 9 Arena',
  },
  {
    titulo: 'Nas - Illmatic Rooftop',
    descricao:
      'Noite mock de hip-hop classico com boom bap, DJ set e clima de rooftop.',
    local: 'Queens Rooftop',
  },
  {
    titulo: 'Wu-Tang Clan - Shaolin Rap Night',
    descricao:
      'Evento mock de rap coletivo com beats sujos, samples soul e cypher no palco.',
    local: 'Shaolin Temple Stage',
  },
  {
    titulo: 'Snoop Dogg - West Coast Vibes',
    descricao:
      'Show mock de hip-hop west coast com groove calmo, baixo quente e pista aberta.',
    local: 'Long Beach Park',
  },
  {
    titulo: 'Tyler, The Creator - Camp Flog Mock',
    descricao:
      'Festival mock colorido de rap alternativo, soul torto e cenografia criativa.',
    local: 'Flower Boy Garden',
  },
  {
    titulo: 'Eminem & 50 Cent - Aftermath Night',
    descricao:
      'Evento mock de rap com hits de arena, punchlines e clima de mixtape classica.',
    local: 'Shady Hall',
  },
  {
    titulo: 'Bring Me The Horizon - Post Human Stage',
    descricao:
      'Show mock misturando metal moderno, eletronico, rap e refracoes gigantes.',
    local: 'Nex Gen Arena',
  },
] as const;

const EVENTOS_TOTAL = EVENTOS_MOCK.length;

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
  const eventoMock = EVENTOS_MOCK[index];

  return {
    titulo: eventoMock.titulo,
    descricao: eventoMock.descricao,
    dataInicio: iso(dataInicio),
    dataFim: iso(dataFim),
    status: 'PUBLICADO',
    local: eventoMock.local,
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
