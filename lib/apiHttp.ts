export const readJsonBody = async <T>(req: any): Promise<T> => {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : ({} as T);
};

export const sendJson = (res: any, status: number, body: unknown) => {
  res.statusCode = status;
  const payload = JSON.stringify(body);
  if (res.json) return res.json(body);
  res.setHeader?.('Content-Type', 'application/json');
  return res.end(payload);
};
