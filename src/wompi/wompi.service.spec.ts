import { WompiService } from './wompi.service'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

let wompi: WompiService
let mockAxios: MockAdapter

beforeEach(() => {
  wompi = new WompiService()
  mockAxios = new MockAdapter(axios)
})

describe('WompiService', () => {
  it('debería ejecutarse sin errores al obtener el acceptance_token', async () => {
    mockAxios.onGet(/\/merchants\//).reply(200, {
      data: {
        presigned_acceptance: {
          acceptance_token: 'dummy_token',
        },
      },
    })

    const token = await (wompi as any).getAcceptanceToken()
    expect(token).toBe('dummy_token')
  })

  it('debería ejecutarse sin errores al obtener el estado de transacción', async () => {
    const txId = 'tx_abc123'
    mockAxios.onGet(/\/transactions\//).reply(200, {
      data: {
        status: 'APPROVED',
      },
    })

    const status = await (wompi as any).getTransactionStatus(txId)
    expect(status).toBe('APPROVED')
  })
})
