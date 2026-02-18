import type { WordType } from "./config.ts";

type Manifest = Record<WordType, { readonly chunks: number; readonly lines: number }>;
type ChunkBuffer = string[];

const shuffle = <T>(xs: readonly T[]): T[] => {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
};

const pickRandom = <T>(xs: readonly T[]): T =>
  xs[Math.floor(Math.random() * xs.length)]!;

const parseChunk = (text: string): readonly string[] =>
  text
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => {
      const defs = line.split(";");
      return pickRandom(defs).trim();
    });

const fetchManifest = async (): Promise<Manifest> => {
  const response = await fetch("/data/manifest.json");
  if (!response.ok) {
    throw new Error(`Failed to load manifest: ${response.status}`);
  }
  return (await response.json()) as Manifest;
};

const fetchChunk = async (
  type: WordType,
  index: number,
): Promise<readonly string[]> => {
  const response = await fetch(`/data/${type}/${index}.txt`);
  if (!response.ok) {
    throw new Error(
      `Failed to load chunk ${type}/${index}: ${response.status}`,
    );
  }
  return shuffle(parseChunk(await response.text()));
};

export type Queue = {
  readonly next: () => Promise<string>;
};

export const createQueue = async (type: WordType): Promise<Queue> => {
  const manifest = await fetchManifest();
  const info = manifest[type];

  if (!info) throw new Error(`Unknown word type: ${type}`);

  const PREFETCH_CONCURRENCY = 1;
  const allChunkIndexes = shuffle(
    Array.from({ length: info.chunks }, (_, index) => index),
  );
  const unseenChunkIndexes = [...allChunkIndexes];
  const buffers: ChunkBuffer[] = [];
  const cache = new Map<number, readonly string[]>();
  let inFlight = 0;
  const waiters: Array<() => void> = [];

  const notify = (): void => {
    while (waiters.length) {
      waiters.shift()?.();
    }
  };

  const waitForUpdate = (): Promise<void> =>
    new Promise((resolve) => {
      waiters.push(resolve);
    });

  const repopulateFromCache = (): void => {
    for (const lines of cache.values()) {
      buffers.push(shuffle([...lines]));
    }
    notify();
  };

  const pumpPrefetch = (): void => {
    while (inFlight < PREFETCH_CONCURRENCY && unseenChunkIndexes.length > 0) {
      const index = unseenChunkIndexes.pop()!;
      inFlight += 1;

      void fetchChunk(type, index)
        .then((lines) => {
          cache.set(index, lines);
          buffers.push([...lines]);
        })
        .catch(() => {
          unseenChunkIndexes.unshift(index);
        })
        .finally(() => {
          inFlight -= 1;
          notify();
          pumpPrefetch();
        });
    }
  };

  const ensureAvailable = async (): Promise<void> => {
    while (buffers.length === 0) {
      if (
        cache.size === info.chunks &&
        inFlight === 0 &&
        unseenChunkIndexes.length === 0
      ) {
        repopulateFromCache();
        continue;
      }

      pumpPrefetch();
      await waitForUpdate();
    }
  };

  pumpPrefetch();
  await ensureAvailable();

  const queue: Queue = {
    next: async () => {
      while (true) {
        await ensureAvailable();

        const bufferIndex = Math.floor(Math.random() * buffers.length);
        const buffer = buffers[bufferIndex]!;
        const value = buffer.pop();

        if (buffer.length === 0) {
          buffers.splice(bufferIndex, 1);
        }

        pumpPrefetch();

        if (value) return value;
      }
    },
  };

  return queue;
};
