import {Express, Request} from 'express';
import {attachmentFileFilter, ALLOWED_UPLOAD_EXTENSIONS, MAX_UPLOAD_BYTES, UnsupportedFileTypeError} from '../attachments';

const fakeFile = (originalname: string): Express.Multer.File => ({
  fieldname: 'pdf',
  originalname,
  encoding: '7bit',
  mimetype: 'application/octet-stream',
  size: 0,
  stream: undefined as never,
  destination: '',
  filename: '',
  path: '',
  buffer: Buffer.alloc(0),
});

const runFilter = (name: string) => new Promise<{err: Error | null; accepted: boolean}>(resolve => {
  const cb = (err: Error | null, accepted?: boolean) => resolve({err, accepted: accepted ?? false});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachmentFileFilter!({} as Request, fakeFile(name), cb as any);
});

describe('attachments route :: upload limits', () => {
  it('caps upload size at 25 MB', () => {
    expect(MAX_UPLOAD_BYTES).toBe(25 * 1024 * 1024);
  });
});

describe('attachments route :: fileFilter', () => {
  it.each([...ALLOWED_UPLOAD_EXTENSIONS])('accepts .%s', async ext => {
    const result = await runFilter(`file.${ext}`);
    expect(result.err).toBeNull();
    expect(result.accepted).toBe(true);
  });

  it('is case-insensitive on the extension', async () => {
    const result = await runFilter('SCAN.PDF');
    expect(result.err).toBeNull();
    expect(result.accepted).toBe(true);
  });

  it('rejects executables and exposes displayExt on the error', async () => {
    const result = await runFilter('payload.exe');
    expect(result.err).toBeInstanceOf(UnsupportedFileTypeError);
    expect((result.err as UnsupportedFileTypeError).displayExt).toBe('.exe');
  });

  it('rejects shell scripts', async () => {
    const result = await runFilter('evil.sh');
    expect(result.err).toBeInstanceOf(UnsupportedFileTypeError);
  });

  it('rejects files with no extension with displayExt=(none)', async () => {
    const result = await runFilter('README');
    expect(result.err).toBeInstanceOf(UnsupportedFileTypeError);
    expect((result.err as UnsupportedFileTypeError).displayExt).toBe('(none)');
  });

  it('rejects svg (potential xss)', async () => {
    const result = await runFilter('icon.svg');
    expect(result.err).toBeInstanceOf(Error);
  });

  it.each(['evil.html', 'evil.htm', 'evil.HTML'])('rejects %s (stored-xss vector)', async name => {
    const result = await runFilter(name);
    expect(result.err).toBeInstanceOf(Error);
    expect(result.accepted).toBe(false);
  });
});
