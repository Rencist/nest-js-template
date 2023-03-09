import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationDto } from 'src/dto/pagination/pagination.dto';
import { matchSorter } from 'match-sorter';
import { sortHelper } from './sortHelper';

export interface IncludeQuery {
  [key: string]: boolean;
}

@Injectable()
export class PaginationService {
  constructor(private prisma: PrismaService) {}

  async paginationFilter(
    paginationQuery: PaginationDto,
    table: string,
    data: unknown,
  ) {
    const take: number | undefined = paginationQuery.pageSize;
    const skip: number | undefined = (paginationQuery.pageIndex - 1) * take;
    const sort: string | undefined = paginationQuery.sort;
    const sortType: 'asc' | 'desc' = paginationQuery.type;
    const globalFilter: string | undefined = paginationQuery.globalFilter;

    let countData = 0;
    let last_page = null;
    const _all = data;

    const stringjson = JSON.stringify(_all);
    const parsedJson = JSON.parse(stringjson);
    const fields = await this.getSchemaFields(parsedJson[0], []);
    let _res = parsedJson;

    if (globalFilter)
      _res = matchSorter(parsedJson, globalFilter, {
        keys: fields,
      });

    countData = _res.length;

    if (_res.length == 0)
      return {
        data: _res,
        meta: {
          last_page,
          total: countData,
        },
      };

    if (sort) {
      if (!(sort in sortHelper[table])) {
        throw new BadRequestException(
          `Field ${sort} not found. Fields available [${Object.keys(
            sortHelper[table],
          )}]`,
        );
      }

      const path = sortHelper[table][sort];

      if (sortType == 'asc') {
        _res = _res.sort((a, b) => {
          if (this.read(a, path) < this.read(b, path)) return -1;
        });
      } else {
        _res = _res.sort((a, b) => {
          if (this.read(a, path) > this.read(b, path)) return -1;
        });
      }
    }

    if (take && skip >= 0) {
      _res = _res.slice(skip, skip + take);
      if (Math.floor(countData / take) != 0 && countData != 0) {
        last_page = Math.round(countData / take);
      } else {
        if (countData > 0 && countData < take) {
          last_page = 1;
        }
      }
    }

    return {
      data: _res,
      meta: {
        last_page,
        total: countData,
      },
    };
  }

  read(obj, path) {
    let o = obj;
    for (const p of path) {
      o = o[p];
    }
    return o;
  }

  async getSchemaFields(schema, result: string[], parent?: string) {
    try {
      if (Array.isArray(schema)) {
        for (let i = 0; i < schema.length; i++) {
          if (parent) this.getSchemaFields(schema[i], result, parent);
          else this.getSchemaFields(schema[i], result);
        }
      } else {
        for (const prop in schema) {
          if (schema[prop] == null) continue;
          if (typeof schema[prop] == 'object' || Array.isArray(schema[prop])) {
            if (
              typeof schema[prop][0] != 'object' &&
              typeof schema[prop][0] != 'undefined'
            ) {
              if (parent) result.push(parent + '.' + prop);
              else result.push(prop);
            } else {
              let newParent = prop;
              if (parent) newParent = parent + '.' + prop;
              this.getSchemaFields(schema[prop], result, newParent);
            }
          } else {
            if (parent) result.push(parent + '.' + prop);
            else result.push(prop);
          }
        }
      }
      return result;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
