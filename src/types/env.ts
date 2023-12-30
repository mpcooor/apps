import { DurableObjectNamespace } from '@cloudflare/workers-types/experimental'

export interface IEnv {
  groups?: DurableObjectNamespace
}
