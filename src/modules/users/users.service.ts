import { Injectable } from '@nestjs/common';
import { and, asc, desc, eq, ilike } from 'drizzle-orm';
import { AppError } from 'src/core/erros/base-app.error';
import { InternalServerError, NotFoundError } from 'src/core/erros/http.errors';
import { DrizzleService } from 'src/infra/database/drizzle.service';
import { UserEntity, users } from 'src/infra/database/schemas';
import { UsersQuery } from './schemas/users-queryschema';
import { DrizzleQueryError } from 'drizzle-orm';
import { UserUpdate } from './dto/uses.dto';
import { ICacheClient } from 'src/infra/cache/cache-client.interface';

@Injectable()
export class UsersService {
  private cacheKey: string = 'users';
  constructor(
    private readonly db: DrizzleService,
    private readonly cache: ICacheClient,
  ) {}

  async findById(id: string): Promise<UserEntity | undefined> {
    try {
      const cached = await this.cache.get<UserEntity>({
        key: this.cacheKey,
        prefix: id,
      });

      if (cached) return cached;

      const [result] = await this.db
        .getInstance()
        .select()
        .from(users)
        .where(eq(users.id, id));

      if (!result) {
        throw new NotFoundError({ message: 'Usuário não encontrado' });
      }

      await this.cache.set({
        key: this.cacheKey,
        prefix: id,
        value: result,
        ttl: 100,
      });

      return result;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new InternalServerError();
    }
  }

  async findAll(query: UsersQuery): Promise<UserEntity[]> {
    const {
      limit = 10,
      offset = 0,
      order = 'desc',
      orderBy = 'createdAt',
      name,
      role,
    } = query ?? {};

    const cached = await this.cache.get<UserEntity[]>({
      key: this.cacheKey,
      prefix: query,
    });

    if (cached) return cached;

    const column = users[orderBy] ?? users.createdAt;

    try {
      const result = await this.db
        .getInstance()
        .select()
        .from(users)
        .where(
          and(
            name ? ilike(users.name, `%${name}%`) : undefined,
            role ? eq(users.role, role) : undefined,
          ),
        )
        .orderBy(order === 'asc' ? asc(column) : desc(column))
        .limit(limit)
        .offset(offset);

      await this.cache.set({
        prefix: query,
        value: result,
        key: this.cacheKey,
        ttl: 100,
      });

      return result;
    } catch (error: unknown) {
      if (error instanceof DrizzleQueryError) {
        throw new InternalServerError({ message: 'Erro durante busca' });
      }
      throw error;
    }
  }

  async updateUser(
    data: UserUpdate,
    id: string,
  ): Promise<UserEntity | undefined> {
    try {
      const [result] = await this.db
        .getInstance()
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();

      if (!result) {
        throw new NotFoundError({ message: 'Usuário não encontrado' });
      }

      return result;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new InternalServerError();
    }
  }
}
