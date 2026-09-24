import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('HTTP Endpoints Scaffold', () => {
  it('GET /health returns 200 with success envelope', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      data: {
        status: 'ok',
      },
    });
  });

  it('GET /unknown returns 404 with error envelope', async () => {
    const res = await request(app).get('/unknown-route-xyz');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'NOT_FOUND');
    expect(res.body.error).toHaveProperty('message');
  });
});
