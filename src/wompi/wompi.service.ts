import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

interface WompiPaymentInput {
  amountInCents: number;
  currency: string;
  customerEmail: string;
  reference: string;
  cardToken: string;
}

@Injectable()
export class WompiService {
  private readonly wompiApiUrl = process.env.WOMPI_SANDBOX_URL || '';
  private readonly publicKey = process.env.WOMPI_PUBLIC_KEY || '';
  private readonly privateKey = process.env.WOMPI_PRIVATE_KEY || '';
  private readonly integritySecret = process.env.WOMPI_INTEGRITY_SECRET || '';

  async getAcceptanceToken(): Promise<string> {
    const url = `${this.wompiApiUrl}/merchants/${this.publicKey}`;
    const response = await axios.get(url);
    const token = response.data.data.presigned_acceptance.acceptance_token;
    console.log('✅ Acceptance token recibido:', token);
    return token;
  }

  private generateSignature(reference: string, amountInCents: number, currency: string): string {
    const plainText = `${reference}${amountInCents}${currency}${this.integritySecret}`;
    console.log('✔️ Plain text para firma:', plainText);
  
    return crypto.createHash('sha256').update(plainText).digest('hex');
  }

  async makeCardPayment(input: WompiPaymentInput): Promise<any> {
    try {
      const acceptanceToken = await this.getAcceptanceToken();
  
      const signature = this.generateSignature(
        input.reference,
        input.amountInCents,
        input.currency
      );
  
      const payload = {
        acceptance_token: acceptanceToken,
        amount_in_cents: input.amountInCents,
        currency: input.currency,
        customer_email: input.customerEmail,
        payment_method: {
          type: 'CARD',
          token: input.cardToken,
          installments: 1,
        },
        reference: input.reference,
        signature,
        redirect_url: 'https://webhook.site/your-redirect-url',
      };
  
      console.log('🚀 Payload final que se envía a Wompi:', payload);
  
      const response = await axios.post(`${this.wompiApiUrl}/transactions`, payload, {
        headers: {
          Authorization: `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.error('❌ Wompi AQUII:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Wompi Payment Error - Status:', error.response?.status);
      console.error('❌ Wompi Payment Error - Data:', JSON.stringify(error.response?.data, null, 2));
      console.error('❌ Wompi Payment Error - Headers:', error.response?.headers);
      throw new Error('Error procesando pago en Wompi');
    }
  }
  
  async getTransactionStatus(wompiTransactionId: string): Promise<string> {
    const url = `${this.wompiApiUrl}/transactions/${wompiTransactionId}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.privateKey}`,
      },
    });
  
    return response.data.data.status; // 'APPROVED' | 'DECLINED' | 'PENDING'
  }
  

  private deepSortObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepSortObject(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result: any, key: string) => {
          result[key] = this.deepSortObject(obj[key]);
          return result;
        }, {});
    }
    return obj;
  }
}
