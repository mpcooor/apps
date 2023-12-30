/* tslint:disable */
/* eslint-disable */
/**
 */
export function start(): void
/**
 * Compute the Keccak256 hash of a value.
 * @param {any} message
 * @returns {any}
 */
export function keccak256(message: any): any
/**
 * Round-based key share generator.
 */
export class KeyGenerator {
  free(): void
  /**
   * Create a key generator.
   * @param {any} parameters
   * @param {any} party_signup
   */
  constructor(parameters: any, party_signup: any)
  /**
   * Handle an incoming message.
   * @param {any} message
   */
  handleIncoming(message: any): void
  /**
   * Proceed to the next round.
   * @returns {any}
   */
  proceed(): any
  /**
   * Create the key share.
   * @returns {any}
   */
  create(): any
}
/**
 * Round-based signing protocol.
 */
export class Signer {
  free(): void
  /**
   * Create a signer.
   * @param {any} index
   * @param {any} participants
   * @param {any} local_key
   */
  constructor(index: any, participants: any, local_key: any)
  /**
   * Handle an incoming message.
   * @param {any} message
   */
  handleIncoming(message: any): void
  /**
   * Proceed to the next round.
   * @returns {any}
   */
  proceed(): any
  /**
   * Generate the completed offline stage and store the result
   * internally to be used when `create()` is called.
   *
   * Return a partial signature that must be sent to the other
   * signing participents.
   * @param {any} message
   * @returns {any}
   */
  partial(message: any): any
  /**
   * Export the complete state
   * @returns {any}
   */
  export_complete_state(): any
  /**
   * Generate partials from the exported complete states
   * @param {any} offline_stage
   * @param {any} message
   * @returns {any}
   */
  partial_from_complete_state(offline_stage: any, message: any): any
  /**
   * Create and verify the signature.
   * @param {any} partials
   * @returns {any}
   */
  create(partials: any): any
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module

export interface InitOutput {
  readonly memory: WebAssembly.Memory
  readonly __wbg_keygenerator_free: (a: number) => void
  readonly keygenerator_new: (a: number, b: number, c: number) => void
  readonly keygenerator_handleIncoming: (a: number, b: number, c: number) => void
  readonly keygenerator_proceed: (a: number, b: number) => void
  readonly keygenerator_create: (a: number, b: number) => void
  readonly __wbg_signer_free: (a: number) => void
  readonly signer_new: (a: number, b: number, c: number, d: number) => void
  readonly signer_handleIncoming: (a: number, b: number, c: number) => void
  readonly signer_proceed: (a: number, b: number) => void
  readonly signer_partial: (a: number, b: number, c: number) => void
  readonly signer_export_complete_state: (a: number, b: number) => void
  readonly signer_partial_from_complete_state: (a: number, b: number, c: number, d: number) => void
  readonly signer_create: (a: number, b: number, c: number) => void
  readonly start: () => void
  readonly keccak256: (a: number, b: number) => void
  readonly rustsecp256k1_v0_4_1_context_create: (a: number) => number
  readonly rustsecp256k1_v0_4_1_context_destroy: (a: number) => void
  readonly rustsecp256k1_v0_4_1_default_illegal_callback_fn: (a: number, b: number) => void
  readonly rustsecp256k1_v0_4_1_default_error_callback_fn: (a: number, b: number) => void
  readonly __wbindgen_malloc: (a: number, b: number) => number
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number
  readonly __wbindgen_free: (a: number, b: number, c: number) => void
  readonly __wbindgen_exn_store: (a: number) => void
  readonly __wbindgen_start: () => void
}

export type SyncInitInput = BufferSource | WebAssembly.Module
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {SyncInitInput} module
 *
 * @returns {InitOutput}
 */
export function initSync(module: SyncInitInput): InitOutput

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {InitInput | Promise<InitInput>} module_or_path
 *
 * @returns {Promise<InitOutput>}
 */
export function init(module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>
