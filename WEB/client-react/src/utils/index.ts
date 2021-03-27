
export type Itryuntil = AsyncGenerator<{
  data: void;
  index: number;
  error?: undefined;
} | {
  error: any;
  index: number;
  data?: undefined;
}, void, unknown>

export async function* tryuntil(func:(index:number, ...params:any[])=>void, ...params:any[]): Itryuntil {
  let index:number = 0;

  while (true) {
    index++;

    try {
      const data = await func(index, ...params);
      yield { data, index };
      break;
    }
    catch (e) {
      yield { error: e, index };
    }

    if (index >= 10) break;
  }
}