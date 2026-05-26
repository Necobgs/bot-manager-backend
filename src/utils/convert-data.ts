export type TypesData = 'numeric' | 'string' | 'boolean' | 'date';

type TypeMap = {
  numeric: number;
  string: string;
  boolean: boolean;
  date: Date;
};

export function convertData<T extends TypesData>(
  data: unknown,
  convertTo: T,
): TypeMap[T] {
  switch (convertTo) {
    case 'numeric': {
      if (typeof data === 'number') return data as TypeMap[T];

      if (typeof data === 'string') {
        const n = Number(data);
        if (!Number.isNaN(n)) return n as TypeMap[T];
      }

      throw new Error('Não é possível converter para number');
    }

    case 'boolean': {
      if (typeof data === 'boolean') return data as TypeMap[T];

      if (typeof data === 'string') {
        if (data === 'true') return true as TypeMap[T];
        if (data === 'false') return false as TypeMap[T];
      }

      if (typeof data === 'number') {
        if (data === 1) return true as TypeMap[T];
        if (data === 0) return false as TypeMap[T];
      }

      throw new Error('Não é possível converter para boolean');
    }

    case 'date': {
      if (data instanceof Date) return data as TypeMap[T];

      if (typeof data === 'string' || typeof data === 'number') {
        const d = new Date(data);
        if (!isNaN(d.getTime())) return d as TypeMap[T];
      }

      throw new Error('Não é possível converter para Date');
    }

    case 'string': {
      if (
        typeof data === 'string' ||
        typeof data === 'number' ||
        typeof data === 'boolean'
      ) {
        return String(data) as TypeMap[T];
      }

      throw new Error('Não é possível converter para string');
    }
  }
}
