import crypto from 'crypto';
import {logger} from '../../logger';

export type OrderWebhookRequest = {
  UpdatedEntityID: number;
  UpdatedEntityType: 'Order';
  /** If a delete happens in Billit, the webhook is not called */
  WebhookUpdateTypeTC: 'U' | 'I';
}

export type MessageWebhookRequest = {
  UpdatedEntityID: number;
  UpdatedEntityType: 'Message';
  WebhookUpdateTypeTC: 'U' | 'I';
  /** In all tests this was just an empty object */
  EntityDetail: {};
}

const webhookSecrets = {
  orderCreated: process.env.BILLIT_WEBHOOK_ORDER_CREATED_SECRET || '',
  orderUpdated: process.env.BILLIT_WEBHOOK_ORDER_UPDATED_SECRET || '',
  messageCreated: process.env.BILLIT_WEBHOOK_MESSAGE_CREATED_SECRET || '',
  messageUpdated: process.env.BILLIT_WEBHOOK_MESSAGE_UPDATED_SECRET || '',
};


/**
 * Validate Billit webhook signature.
 * billitSignature format: "t=1767174960,s=4588...55812"
 * The signature is a SHA-256 hash of "timestamp.body"
 */
export function validateSignature(type: keyof typeof webhookSecrets, billitSignature: string, body: any): boolean {
  const [timestampPart, signaturePart] = billitSignature.split(',');
  if (!timestampPart || !signaturePart) {
    return false;
  }

  const timestamp = timestampPart.split('=')[1];
  const providedHash = signaturePart.split('=')[1];
  if (!timestamp || !providedHash) {
    return false;
  }

  const payload = `${timestamp}.${JSON.stringify(body)}`;
  const computedHash = crypto
    .createHmac('sha256', webhookSecrets[type])
    .update(payload)
    .digest('hex');

  const computedBuffer = Buffer.from(computedHash, 'hex');
  const providedBuffer = Buffer.from(providedHash, 'hex');

  if (computedBuffer.length !== providedBuffer.length) {
    return false;
  }

  const valid = crypto.timingSafeEqual(
    new Uint8Array(computedBuffer),
    new Uint8Array(providedBuffer),
  );

  if (!valid) {
    logger.error(`Webhook signature failed for ${type}: ${JSON.stringify(body)} (Sig=${billitSignature})`);
    throw new Error('Billit Webhook signature check failed');
  }

  return valid;
}
