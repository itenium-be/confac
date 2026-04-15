import {vi, afterEach} from 'vitest';
import type {Logger} from 'winston';
import {mergePdfBuffers} from '../index';

vi.mock('../../../config', () => ({default: {services: {gotenbergUrl: 'http://gotenberg:3000'}}}));

const fakeLogger = {info: vi.fn(), warn: vi.fn(), error: vi.fn()} as unknown as Logger;

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('mergePdfBuffers', () => {
  it('returns the single buffer untouched without hitting gotenberg', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const buf = Buffer.from('single pdf');
    const out = await mergePdfBuffers(fakeLogger, [buf]);
    expect(out).toBe(buf);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('throws on empty input', async () => {
    await expect(mergePdfBuffers(fakeLogger, [])).rejects.toThrow(/no buffers/);
  });

  it('POSTs to the merge endpoint and returns the merged bytes', async () => {
    const merged = Buffer.from('%PDF-merged-bytes');
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      arrayBuffer: async () => merged.buffer.slice(merged.byteOffset, merged.byteOffset + merged.byteLength),
    } as unknown as Response);
    vi.stubGlobal('fetch', fetchSpy);

    const out = await mergePdfBuffers(fakeLogger, [Buffer.from('a'), Buffer.from('b'), Buffer.from('c')]);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe('http://gotenberg:3000/forms/pdfengines/merge');
    expect((init as RequestInit).method).toBe('POST');
    expect((init as RequestInit).body).toBeInstanceOf(FormData);
    expect(out.equals(merged)).toBe(true);
  });

  it('uses zero-padded numeric filenames so merge order matches input order', async () => {
    let capturedForm: FormData | undefined;
    const fetchSpy = vi.fn().mockImplementation(async (_url: string, init: RequestInit) => {
      capturedForm = init.body as FormData;
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        arrayBuffer: async () => new ArrayBuffer(0),
      } as unknown as Response;
    });
    vi.stubGlobal('fetch', fetchSpy);

    await mergePdfBuffers(fakeLogger, [Buffer.from('a'), Buffer.from('b'), Buffer.from('c')]);

    const names = capturedForm!.getAll('files').map(v => (v as File).name);
    expect(names).toEqual(['00.pdf', '01.pdf', '02.pdf']);
  });

  it('throws a descriptive error when gotenberg returns a non-2xx', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: new Headers({'gotenberg-trace': 'abc123'}),
      text: async () => 'merge engine failed',
    } as unknown as Response));

    await expect(mergePdfBuffers(fakeLogger, [Buffer.from('a'), Buffer.from('b')]))
      .rejects.toThrow(/Gotenberg merge returned 500/);
  });

  it('throws a descriptive error when fetch itself fails (network down)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')));
    await expect(mergePdfBuffers(fakeLogger, [Buffer.from('a'), Buffer.from('b')]))
      .rejects.toThrow(/Gotenberg merge fetch failed.*ECONNREFUSED/);
  });
});
