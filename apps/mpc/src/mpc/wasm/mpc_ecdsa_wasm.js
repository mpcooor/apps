import base64Wasm from './built'

/* tslint-disable */

let wasm

const heap = new Array(128).fill(undefined)

heap.push(undefined, null, true, false)

function getObject(idx) {
  return heap[idx]
}

let heap_next = heap.length

function dropObject(idx) {
  if (idx < 132) return
  heap[idx] = heap_next
  heap_next = idx
}

function takeObject(idx) {
  const ret = getObject(idx)
  dropObject(idx)
  return ret
}

let WASM_VECTOR_LEN = 0

let cachedUint8Memory0 = null

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer)
  }
  return cachedUint8Memory0
}

const cachedTextEncoder =
  typeof TextEncoder !== 'undefined'
    ? new TextEncoder('utf-8')
    : {
        encode: () => {
          throw Error('TextEncoder not available')
        }
      }

const encodeString =
  typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view)
      }
    : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg)
        view.set(buf)
        return {
          read: arg.length,
          written: buf.length
        }
      }

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg)
    const ptr = malloc(buf.length, 1) >>> 0
    getUint8Memory0()
      .subarray(ptr, ptr + buf.length)
      .set(buf)
    WASM_VECTOR_LEN = buf.length
    return ptr
  }

  let len = arg.length
  let ptr = malloc(len, 1) >>> 0

  const mem = getUint8Memory0()

  let offset = 0

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset)
    if (code > 0x7f) break
    mem[ptr + offset] = code
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset)
    }
    ptr = realloc(ptr, len, (len = offset + arg.length * 3), 1) >>> 0
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len)
    const ret = encodeString(arg, view)

    offset += ret.written
  }

  WASM_VECTOR_LEN = offset
  return ptr
}

function isLikeNone(x) {
  return x === undefined || x === null
}

let cachedInt32Memory0 = null

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer)
  }
  return cachedInt32Memory0
}

const cachedTextDecoder =
  typeof TextDecoder !== 'undefined'
    ? new TextDecoder('utf-8', { fatal: true, ignoreBOM: true })
    : {
        decode: () => {
          throw Error('TextDecoder not available')
        }
      }

if (typeof TextDecoder !== 'undefined') {
  cachedTextDecoder.decode()
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len))
}

function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1)
  const idx = heap_next
  heap_next = heap[idx]

  heap[idx] = obj
  return idx
}

let cachedFloat64Memory0 = null

function getFloat64Memory0() {
  if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
    cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer)
  }
  return cachedFloat64Memory0
}

function debugString(val) {
  // primitive types
  const type = typeof val
  if (type == 'number' || type == 'boolean' || val == null) {
    return `${val}`
  }
  if (type == 'string') {
    return `"${val}"`
  }
  if (type == 'symbol') {
    const description = val.description
    if (description == null) {
      return 'Symbol'
    } else {
      return `Symbol(${description})`
    }
  }
  if (type == 'function') {
    const name = val.name
    if (typeof name == 'string' && name.length > 0) {
      return `Function(${name})`
    } else {
      return 'Function'
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length
    let debug = '['
    if (length > 0) {
      debug += debugString(val[0])
    }
    for (let i = 1; i < length; i++) {
      debug += ', ' + debugString(val[i])
    }
    debug += ']'
    return debug
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val))
  let className
  if (builtInMatches.length > 1) {
    className = builtInMatches[1]
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val)
  }
  if (className == 'Object') {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return 'Object(' + JSON.stringify(val) + ')'
    } catch (_) {
      return 'Object'
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className
}
/**
 */
export function start() {
  wasm.start()
}

/**
 * Compute the Keccak256 hash of a value.
 * @param {any} message
 * @returns {any}
 */
export function keccak256(message) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
    wasm.keccak256(retptr, addHeapObject(message))
    var r0 = getInt32Memory0()[retptr / 4 + 0]
    var r1 = getInt32Memory0()[retptr / 4 + 1]
    var r2 = getInt32Memory0()[retptr / 4 + 2]
    if (r2) {
      throw takeObject(r1)
    }
    return takeObject(r0)
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16)
  }
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len)
}

function handleError(f, args) {
  try {
    return f.apply(this, args)
  } catch (e) {
    wasm.__wbindgen_exn_store(addHeapObject(e))
  }
}
/**
 * Round-based key share generator.
 */
export class KeyGenerator {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0

    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_keygenerator_free(ptr)
  }
  /**
   * Create a key generator.
   * @param {any} parameters
   * @param {any} party_signup
   */
  constructor(parameters, party_signup) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.keygenerator_new(retptr, addHeapObject(parameters), addHeapObject(party_signup))
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      var r2 = getInt32Memory0()[retptr / 4 + 2]
      if (r2) {
        throw takeObject(r1)
      }
      this.__wbg_ptr = r0 >>> 0
      return this
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * Handle an incoming message.
   * @param {any} message
   */
  handleIncoming(message) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.keygenerator_handleIncoming(retptr, this.__wbg_ptr, addHeapObject(message))
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      if (r1) {
        throw takeObject(r0)
      }
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * Proceed to the next round.
   * @returns {any}
   */
  proceed() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.keygenerator_proceed(retptr, this.__wbg_ptr)
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      var r2 = getInt32Memory0()[retptr / 4 + 2]
      if (r2) {
        throw takeObject(r1)
      }
      return takeObject(r0)
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * Create the key share.
   * @returns {any}
   */
  create() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.keygenerator_create(retptr, this.__wbg_ptr)
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      var r2 = getInt32Memory0()[retptr / 4 + 2]
      if (r2) {
        throw takeObject(r1)
      }
      return takeObject(r0)
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
}
/**
 * Round-based signing protocol.
 */
export class Signer {
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr
    this.__wbg_ptr = 0

    return ptr
  }

  free() {
    const ptr = this.__destroy_into_raw()
    wasm.__wbg_signer_free(ptr)
  }
  /**
   * Create a signer.
   * @param {any} index
   * @param {any} participants
   * @param {any} local_key
   */
  constructor(index, participants, local_key) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.signer_new(retptr, addHeapObject(index), addHeapObject(participants), addHeapObject(local_key))
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      var r2 = getInt32Memory0()[retptr / 4 + 2]
      if (r2) {
        throw takeObject(r1)
      }
      this.__wbg_ptr = r0 >>> 0
      return this
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * Handle an incoming message.
   * @param {any} message
   */
  handleIncoming(message) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.signer_handleIncoming(retptr, this.__wbg_ptr, addHeapObject(message))
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      if (r1) {
        throw takeObject(r0)
      }
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * Proceed to the next round.
   * @returns {any}
   */
  proceed() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.signer_proceed(retptr, this.__wbg_ptr)
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      var r2 = getInt32Memory0()[retptr / 4 + 2]
      if (r2) {
        throw takeObject(r1)
      }
      return takeObject(r0)
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * Generate the completed offline stage and store the result
   * internally to be used when `create()` is called.
   *
   * Return a partial signature that must be sent to the other
   * signing participents.
   * @param {any} message
   * @returns {any}
   */
  partial(message) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.signer_partial(retptr, this.__wbg_ptr, addHeapObject(message))
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      var r2 = getInt32Memory0()[retptr / 4 + 2]
      if (r2) {
        throw takeObject(r1)
      }
      return takeObject(r0)
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * Export the complete state
   * @returns {any}
   */
  export_complete_state() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.signer_export_complete_state(retptr, this.__wbg_ptr)
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      var r2 = getInt32Memory0()[retptr / 4 + 2]
      if (r2) {
        throw takeObject(r1)
      }
      return takeObject(r0)
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * Generate partials from the exported complete states
   * @param {any} offline_stage
   * @param {any} message
   * @returns {any}
   */
  partial_from_complete_state(offline_stage, message) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.signer_partial_from_complete_state(
        retptr,
        this.__wbg_ptr,
        addHeapObject(offline_stage),
        addHeapObject(message)
      )
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      var r2 = getInt32Memory0()[retptr / 4 + 2]
      if (r2) {
        throw takeObject(r1)
      }
      return takeObject(r0)
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
  /**
   * Create and verify the signature.
   * @param {any} partials
   * @returns {any}
   */
  create(partials) {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16)
      wasm.signer_create(retptr, this.__wbg_ptr, addHeapObject(partials))
      var r0 = getInt32Memory0()[retptr / 4 + 0]
      var r1 = getInt32Memory0()[retptr / 4 + 1]
      var r2 = getInt32Memory0()[retptr / 4 + 2]
      if (r2) {
        throw takeObject(r1)
      }
      return takeObject(r0)
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16)
    }
  }
}

async function __wbg_load(module, imports) {
  if (typeof Response === 'function' && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        return await WebAssembly.instantiateStreaming(module, imports)
      } catch (e) {
        if (module.headers.get('Content-Type') != 'application/wasm') {
          console.warn(
            '`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n',
            e
          )
        } else {
          throw e
        }
      }
    }

    const bytes = await module.arrayBuffer()
    return await WebAssembly.instantiate(bytes, imports)
  } else {
    const instance = await WebAssembly.instantiate(module, imports)

    if (instance instanceof WebAssembly.Instance) {
      return { instance, module }
    } else {
      return instance
    }
  }
}

function __wbg_get_imports() {
  const imports = {}
  imports.wbg = {}
  imports.wbg.__wbindgen_is_undefined = function (arg0) {
    const ret = getObject(arg0) === undefined
    return ret
  }
  imports.wbg.__wbindgen_in = function (arg0, arg1) {
    const ret = getObject(arg0) in getObject(arg1)
    return ret
  }
  imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
    takeObject(arg0)
  }
  imports.wbg.__wbindgen_string_get = function (arg0, arg1) {
    const obj = getObject(arg1)
    const ret = typeof obj === 'string' ? obj : undefined
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    var len1 = WASM_VECTOR_LEN
    getInt32Memory0()[arg0 / 4 + 1] = len1
    getInt32Memory0()[arg0 / 4 + 0] = ptr1
  }
  imports.wbg.__wbindgen_is_object = function (arg0) {
    const val = getObject(arg0)
    const ret = typeof val === 'object' && val !== null
    return ret
  }
  imports.wbg.__wbindgen_is_string = function (arg0) {
    const ret = typeof getObject(arg0) === 'string'
    return ret
  }
  imports.wbg.__wbindgen_error_new = function (arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1))
    return addHeapObject(ret)
  }
  imports.wbg.__wbindgen_number_new = function (arg0) {
    const ret = arg0
    return addHeapObject(ret)
  }
  imports.wbg.__wbindgen_jsval_loose_eq = function (arg0, arg1) {
    const ret = getObject(arg0) == getObject(arg1)
    return ret
  }
  imports.wbg.__wbindgen_object_clone_ref = function (arg0) {
    const ret = getObject(arg0)
    return addHeapObject(ret)
  }
  imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1)
    return addHeapObject(ret)
  }
  imports.wbg.__wbindgen_boolean_get = function (arg0) {
    const v = getObject(arg0)
    const ret = typeof v === 'boolean' ? (v ? 1 : 0) : 2
    return ret
  }
  imports.wbg.__wbindgen_number_get = function (arg0, arg1) {
    const obj = getObject(arg1)
    const ret = typeof obj === 'number' ? obj : undefined
    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret)
  }
  imports.wbg.__wbg_getwithrefkey_5e6d9547403deab8 = function (arg0, arg1) {
    const ret = getObject(arg0)[getObject(arg1)]
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_set_841ac57cff3d672b = function (arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2)
  }
  imports.wbg.__wbg_String_88810dfeb4021902 = function (arg0, arg1) {
    const ret = String(getObject(arg1))
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    getInt32Memory0()[arg0 / 4 + 1] = len1
    getInt32Memory0()[arg0 / 4 + 0] = ptr1
  }
  imports.wbg.__wbg_debug_8f9a97dc395d342f = function (arg0, arg1, arg2, arg3) {
    console.debug(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3))
  }
  imports.wbg.__wbg_error_94a25ece8eeb7bca = function (arg0, arg1, arg2, arg3) {
    console.error(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3))
  }
  imports.wbg.__wbg_info_1d035e3d63b89260 = function (arg0, arg1, arg2, arg3) {
    console.info(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3))
  }
  imports.wbg.__wbg_log_00bb83da94eb9ca8 = function (arg0, arg1, arg2, arg3) {
    console.log(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3))
  }
  imports.wbg.__wbg_warn_fab4b297e5c436a0 = function (arg0, arg1, arg2, arg3) {
    console.warn(getObject(arg0), getObject(arg1), getObject(arg2), getObject(arg3))
  }
  imports.wbg.__wbg_new_abda76e883ba8a5f = function () {
    const ret = new Error()
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_stack_658279fe44541cf6 = function (arg0, arg1) {
    const ret = getObject(arg1).stack
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    getInt32Memory0()[arg0 / 4 + 1] = len1
    getInt32Memory0()[arg0 / 4 + 0] = ptr1
  }
  imports.wbg.__wbg_error_f851667af71bcfc6 = function (arg0, arg1) {
    let deferred0_0
    let deferred0_1
    try {
      deferred0_0 = arg0
      deferred0_1 = arg1
      console.error(getStringFromWasm0(arg0, arg1))
    } finally {
      wasm.__wbindgen_free(deferred0_0, deferred0_1, 1)
    }
  }
  imports.wbg.__wbg_getRandomValues_02639197c8166a96 = function (arg0, arg1, arg2) {
    getObject(arg0).getRandomValues(getArrayU8FromWasm0(arg1, arg2))
  }
  imports.wbg.__wbg_randomFillSync_dd2297de5917c74e = function (arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2))
  }
  imports.wbg.__wbg_new_d87f272aec784ec0 = function (arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1))
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_call_eae29933372a39be = function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1))
    return addHeapObject(ret)
  }
  imports.wbg.__wbindgen_jsval_eq = function (arg0, arg1) {
    const ret = getObject(arg0) === getObject(arg1)
    return ret
  }
  imports.wbg.__wbg_self_e0b3266d2d9eba1a = function (arg0) {
    const ret = getObject(arg0).self
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_crypto_e95a6e54c5c2e37f = function (arg0) {
    const ret = getObject(arg0).crypto
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_getRandomValues_dc67302a7bd1aec5 = function (arg0) {
    const ret = getObject(arg0).getRandomValues
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_require_0993fe224bf8e202 = function (arg0, arg1) {
    const ret = require(getStringFromWasm0(arg0, arg1))
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_randomFillSync_85b3f4c52c56c313 = function (arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2))
  }
  imports.wbg.__wbg_getRandomValues_cd175915511f705e = function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1))
  }
  imports.wbg.__wbg_self_7eede1f4488bf346 = function () {
    return handleError(function () {
      const ret = self.self
      return addHeapObject(ret)
    }, arguments)
  }
  imports.wbg.__wbg_crypto_c909fb428dcbddb6 = function (arg0) {
    const ret = getObject(arg0).crypto
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_msCrypto_511eefefbfc70ae4 = function (arg0) {
    const ret = getObject(arg0).msCrypto
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_static_accessor_MODULE_ef3aa2eb251158a5 = function () {
    const ret = module
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_require_900d5c3984fe7703 = function (arg0, arg1, arg2) {
    const ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2))
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_getRandomValues_307049345d0bd88c = function (arg0) {
    const ret = getObject(arg0).getRandomValues
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_get_4a9aa5157afeb382 = function (arg0, arg1) {
    const ret = getObject(arg0)[arg1 >>> 0]
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_length_cace2e0b3ddc0502 = function (arg0) {
    const ret = getObject(arg0).length
    return ret
  }
  imports.wbg.__wbg_new_08236689f0afb357 = function () {
    const ret = []
    return addHeapObject(ret)
  }
  imports.wbg.__wbindgen_is_function = function (arg0) {
    const ret = typeof getObject(arg0) === 'function'
    return ret
  }
  imports.wbg.__wbg_next_15da6a3df9290720 = function (arg0) {
    const ret = getObject(arg0).next
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_next_1989a20442400aaa = function () {
    return handleError(function (arg0) {
      const ret = getObject(arg0).next()
      return addHeapObject(ret)
    }, arguments)
  }
  imports.wbg.__wbg_done_bc26bf4ada718266 = function (arg0) {
    const ret = getObject(arg0).done
    return ret
  }
  imports.wbg.__wbg_value_0570714ff7d75f35 = function (arg0) {
    const ret = getObject(arg0).value
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_iterator_7ee1a391d310f8e4 = function () {
    const ret = Symbol.iterator
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_get_2aff440840bb6202 = function () {
    return handleError(function (arg0, arg1) {
      const ret = Reflect.get(getObject(arg0), getObject(arg1))
      return addHeapObject(ret)
    }, arguments)
  }
  imports.wbg.__wbg_call_669127b9d730c650 = function () {
    return handleError(function (arg0, arg1) {
      const ret = getObject(arg0).call(getObject(arg1))
      return addHeapObject(ret)
    }, arguments)
  }
  imports.wbg.__wbg_new_c728d68b8b34487e = function () {
    const ret = new Object()
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_set_0ac78a2bc07da03c = function (arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2)
  }
  imports.wbg.__wbg_from_ba72c50feaf1d8c0 = function (arg0) {
    const ret = Array.from(getObject(arg0))
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_isArray_38525be7442aa21e = function (arg0) {
    const ret = Array.isArray(getObject(arg0))
    return ret
  }
  imports.wbg.__wbg_instanceof_ArrayBuffer_c7cc317e5c29cc0d = function (arg0) {
    let result
    try {
      result = getObject(arg0) instanceof ArrayBuffer
    } catch (_) {
      result = false
    }
    const ret = result
    return ret
  }
  imports.wbg.__wbg_isSafeInteger_c38b0a16d0c7cef7 = function (arg0) {
    const ret = Number.isSafeInteger(getObject(arg0))
    return ret
  }
  imports.wbg.__wbg_entries_6d727b73ee02b7ce = function (arg0) {
    const ret = Object.entries(getObject(arg0))
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_buffer_344d9b41efe96da7 = function (arg0) {
    const ret = getObject(arg0).buffer
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_newwithbyteoffsetandlength_2dc04d99088b15e3 = function (arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0)
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_new_d8a000788389a31e = function (arg0) {
    const ret = new Uint8Array(getObject(arg0))
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_set_dcfd613a3420f908 = function (arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0)
  }
  imports.wbg.__wbg_length_a5587d6cd79ab197 = function (arg0) {
    const ret = getObject(arg0).length
    return ret
  }
  imports.wbg.__wbg_instanceof_Uint8Array_19e6f142a5e7e1e1 = function (arg0) {
    let result
    try {
      result = getObject(arg0) instanceof Uint8Array
    } catch (_) {
      result = false
    }
    const ret = result
    return ret
  }
  imports.wbg.__wbg_newwithlength_13b5319ab422dcf6 = function (arg0) {
    const ret = new Uint8Array(arg0 >>> 0)
    return addHeapObject(ret)
  }
  imports.wbg.__wbg_subarray_6ca5cfa7fbb9abbe = function (arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0)
    return addHeapObject(ret)
  }
  imports.wbg.__wbindgen_debug_string = function (arg0, arg1) {
    const ret = debugString(getObject(arg1))
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc)
    const len1 = WASM_VECTOR_LEN
    getInt32Memory0()[arg0 / 4 + 1] = len1
    getInt32Memory0()[arg0 / 4 + 0] = ptr1
  }
  imports.wbg.__wbindgen_throw = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1))
  }
  imports.wbg.__wbindgen_memory = function () {
    const ret = wasm.memory
    return addHeapObject(ret)
  }

  return imports
}

function __wbg_init_memory(imports, maybe_memory) {}

function __wbg_finalize_init(instance, module) {
  wasm = instance.exports
  init.__wbindgen_wasm_module = module
  cachedFloat64Memory0 = null
  cachedInt32Memory0 = null
  cachedUint8Memory0 = null

  wasm.__wbindgen_start()
  return wasm
}

function initSync(module) {
  if (wasm !== undefined) return wasm

  const imports = __wbg_get_imports()

  __wbg_init_memory(imports)

  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module)
  }

  const instance = new WebAssembly.Instance(module, imports)

  return __wbg_finalize_init(instance, module)
}

function asciiToBinary(str) {
  if (typeof atob === 'function') {
    return atob(str)
  } else {
    return new Buffer(str, 'base64').toString('binary')
  }
}

function decode(encoded) {
  var binaryString = asciiToBinary(encoded)
  var bytes = new Uint8Array(binaryString.length)
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

async function init() {
  const input = decode(base64Wasm)

  const imports = __wbg_get_imports()

  __wbg_init_memory(imports)

  const { instance, module } = await __wbg_load(await input, imports)

  return __wbg_finalize_init(instance, module)
}

export { initSync, init }
