import {Request, Response} from 'express';
import {getAttachmentController} from '../attachments';

type Captured = {type?: string; headers: Record<string, string>; body?: Buffer; status?: number};

const makeRes = () => {
  const captured: Captured = {headers: {}};
  const res = {
    type(t: string) { captured.type = t; return res; },
    set(k: string, v: string) { captured.headers[k] = v; return res; },
    send(b: Buffer) { captured.body = b; return res; },
    status(s: number) { captured.status = s; return res; },
  };
  return {res: res as unknown as Response, captured};
};

const makeReq = (fileName: string, type: string) => ({
  params: {id: '507f1f77bcf86cd799439011', model: 'invoice', type, fileName},
  query: {},
  db: {collection: () => ({findOne: () => Promise.resolve({[type]: {buffer: Buffer.from('stored content')}})})},
  logger: {info: () => {}},
} as unknown as Request);

describe('attachments controller :: getAttachmentController legacy html handling', () => {
  it.each(['legacy.htm', 'legacy.html', 'LEGACY.HTM'])('serves %s as text/plain attachment', async fileName => {
    const {res, captured} = makeRes();
    await getAttachmentController(makeReq(fileName, 'doc'), res);
    expect(captured.type).toBe('text/plain');
    expect(captured.headers['Content-Disposition']).toContain('attachment');
    expect(captured.headers['Content-Disposition']).toContain(encodeURIComponent(fileName));
  });

  it('keeps inline disposition for pdfs', async () => {
    const {res, captured} = makeRes();
    await getAttachmentController(makeReq('invoice.pdf', 'pdf'), res);
    expect(captured.type).toBe('application/pdf');
    expect(captured.headers['Content-Disposition']).toContain('inline');
  });

  it('keeps inline disposition for images', async () => {
    const {res, captured} = makeRes();
    await getAttachmentController(makeReq('scan.jpeg', 'extra'), res);
    expect(captured.type).toBe('image/jpeg');
    expect(captured.headers['Content-Disposition']).toContain('inline');
  });
});
