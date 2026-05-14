import { randomBytes, scrypt as nodeScrypt } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { db } from 'src/infra/database/drizzle-client';
import {
  accounts,
  eventos,
  tipoIngresso,
  users,
} from 'src/infra/database/schemas';

const PASSWORD_CONFIG = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64,
  maxmem: 128 * 16384 * 16 * 2,
} as const;

export type SeedUserInput = {
  name: string;
  email: string;
  cpf: string;
  password: string;
};

export type SeedEventoInput = typeof eventos.$inferInsert;
export type SeedTipoIngressoInput = typeof tipoIngresso.$inferInsert;

async function hashBetterAuthPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const key = await new Promise<Buffer>((resolve, reject) => {
    nodeScrypt(
      password.normalize('NFKC'),
      salt,
      PASSWORD_CONFIG.dkLen,
      PASSWORD_CONFIG,
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(derivedKey);
      },
    );
  });

  return `${salt}:${key.toString('hex')}`;
}

async function criarContaCredencial(userId: string, password: string) {
  const senhaHash = await hashBetterAuthPassword(password);
  const now = new Date();

  const conta = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, userId),
      eq(accounts.providerId, 'credential'),
    ),
  });

  if (conta) {
    const [atualizada] = await db
      .update(accounts)
      .set({
        accountId: userId,
        password: senhaHash,
        updatedAt: now,
      })
      .where(eq(accounts.id, conta.id))
      .returning();

    return atualizada;
  }

  const [criada] = await db
    .insert(accounts)
    .values({
      accountId: userId,
      providerId: 'credential',
      userId,
      password: senhaHash,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return criada;
}

export async function criarUsuarioSeed(input: SeedUserInput) {
  const email = input.email.toLowerCase();
  const now = new Date().toISOString();

  const usuarioPorEmail = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  const usuarioPorCpf = await db.query.users.findFirst({
    where: eq(users.cpf, input.cpf),
  });

  if (
    usuarioPorEmail &&
    usuarioPorCpf &&
    usuarioPorEmail.id !== usuarioPorCpf.id
  ) {
    throw new Error(
      `Nao foi possivel criar o usuario seed: email "${email}" e cpf "${input.cpf}" pertencem a usuarios diferentes.`,
    );
  }

  const usuarioExistente = usuarioPorEmail ?? usuarioPorCpf;

  if (usuarioExistente) {
    const [atualizado] = await db
      .update(users)
      .set({
        name: input.name,
        email,
        cpf: input.cpf,
        updatedAt: now,
      })
      .where(eq(users.id, usuarioExistente.id))
      .returning();

    await criarContaCredencial(atualizado.id, input.password);
    return atualizado;
  }

  const [criado] = await db
    .insert(users)
    .values({
      name: input.name,
      email,
      cpf: input.cpf,
      emailVerified: false,
      createdAt: now,
    })
    .returning();

  await criarContaCredencial(criado.id, input.password);
  return criado;
}

export async function criarEvento(input: SeedEventoInput) {
  const eventoExistente = await db.query.eventos.findFirst({
    where: and(
      eq(eventos.titulo, input.titulo),
      eq(eventos.organizadorId, input.organizadorId),
    ),
  });

  if (eventoExistente) return eventoExistente;

  const [criado] = await db.insert(eventos).values(input).returning();
  return criado;
}

export async function criarTipoIngresso(input: SeedTipoIngressoInput) {
  const tipoExistente = await db.query.tipoIngresso.findFirst({
    where: and(
      eq(tipoIngresso.eventoId, input.eventoId),
      eq(tipoIngresso.nome, input.nome),
    ),
  });

  if (tipoExistente) return tipoExistente;

  const [criado] = await db.insert(tipoIngresso).values(input).returning();
  return criado;
}
