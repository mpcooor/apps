import { IKeyShare, IMessage, IPresignState } from '@llama-wallet/types'

export function bufferToHex(array: Uint8Array | ArrayBuffer): string {
  return Buffer.from(array).toString('hex')
}

export function hexToBuffer(hex: string): Uint8Array {
  return Uint8Array.from(Buffer.from(hex, 'hex'))
}

export function stringToBuffer(string: string): Uint8Array {
  return Uint8Array.from(Buffer.from(string))
}

export function keyShareToString(key: IKeyShare): string {
  for (let i = 0; i < key.localKey.h1_h2_n_tilde_vec.length; i++) {
    key.localKey.h1_h2_n_tilde_vec[i].N = bufferToHex(key.localKey.h1_h2_n_tilde_vec[i].N as Uint8Array)
    key.localKey.h1_h2_n_tilde_vec[i].g = bufferToHex(key.localKey.h1_h2_n_tilde_vec[i].g as Uint8Array)
    key.localKey.h1_h2_n_tilde_vec[i].ni = bufferToHex(key.localKey.h1_h2_n_tilde_vec[i].ni as Uint8Array)
  }

  key.localKey.keys_linear.x_i.scalar = bufferToHex(key.localKey.keys_linear.x_i.scalar as Uint8Array)

  key.localKey.keys_linear.y.point = bufferToHex(key.localKey.keys_linear.y.point as Uint8Array)

  for (let i = 0; i < key.localKey.pk_vec.length; i++) {
    key.localKey.pk_vec[i].point = bufferToHex(key.localKey.pk_vec[i].point as Uint8Array)
  }

  for (let i = 0; i < key.localKey.vss_scheme.commitments.length; i++) {
    key.localKey.vss_scheme.commitments[i].point = bufferToHex(
      key.localKey.vss_scheme.commitments[i].point as Uint8Array
    )
  }

  key.localKey.y_sum_s.point = bufferToHex(key.localKey.y_sum_s.point as Uint8Array)

  return JSON.stringify(key)
}

export function keyShareFromString(rawKey: string): IKeyShare {
  const key = JSON.parse(rawKey)

  for (let i = 0; i < key.localKey.h1_h2_n_tilde_vec.length; i++) {
    key.localKey.h1_h2_n_tilde_vec[i].N = hexToBuffer(key.localKey.h1_h2_n_tilde_vec[i].N)
    key.localKey.h1_h2_n_tilde_vec[i].g = hexToBuffer(key.localKey.h1_h2_n_tilde_vec[i].g)
    key.localKey.h1_h2_n_tilde_vec[i].ni = hexToBuffer(key.localKey.h1_h2_n_tilde_vec[i].ni)
  }

  key.localKey.keys_linear.x_i.scalar = hexToBuffer(key.localKey.keys_linear.x_i.scalar)

  key.localKey.keys_linear.y.point = hexToBuffer(key.localKey.keys_linear.y.point)

  for (let i = 0; i < key.localKey.pk_vec.length; i++) {
    key.localKey.pk_vec[i].point = hexToBuffer(key.localKey.pk_vec[i].point)
  }

  for (let i = 0; i < key.localKey.vss_scheme.commitments.length; i++) {
    key.localKey.vss_scheme.commitments[i].point = hexToBuffer(key.localKey.vss_scheme.commitments[i].point)
  }

  key.localKey.y_sum_s.point = hexToBuffer(key.localKey.y_sum_s.point)

  return key
}

export function presignStateToString(presign: IPresignState): string {
  presign.presign.R.point = bufferToHex(presign.presign.R.point as Uint8Array)

  for (let i = 0; i < presign.presign.local_key.h1_h2_n_tilde_vec.length; i++) {
    presign.presign.local_key.h1_h2_n_tilde_vec[i].N = bufferToHex(
      presign.presign.local_key.h1_h2_n_tilde_vec[i].N as Uint8Array
    )
    presign.presign.local_key.h1_h2_n_tilde_vec[i].g = bufferToHex(
      presign.presign.local_key.h1_h2_n_tilde_vec[i].g as Uint8Array
    )
    presign.presign.local_key.h1_h2_n_tilde_vec[i].ni = bufferToHex(
      presign.presign.local_key.h1_h2_n_tilde_vec[i].ni as Uint8Array
    )
  }

  presign.presign.local_key.keys_linear.x_i.scalar = bufferToHex(
    presign.presign.local_key.keys_linear.x_i.scalar as Uint8Array
  )
  presign.presign.local_key.keys_linear.y.point = bufferToHex(
    presign.presign.local_key.keys_linear.y.point as Uint8Array
  )

  for (let i = 0; i < presign.presign.local_key.pk_vec.length; i++) {
    presign.presign.local_key.pk_vec[i].point = bufferToHex(presign.presign.local_key.pk_vec[i].point as Uint8Array)
  }

  for (let i = 0; i < presign.presign.local_key.vss_scheme.commitments.length; i++) {
    presign.presign.local_key.vss_scheme.commitments[i].point = bufferToHex(
      presign.presign.local_key.vss_scheme.commitments[i].point as Uint8Array
    )
  }

  presign.presign.local_key.y_sum_s.point = bufferToHex(presign.presign.local_key.y_sum_s.point as Uint8Array)

  presign.presign.sigma_i.scalar = bufferToHex(presign.presign.sigma_i.scalar as Uint8Array)

  presign.presign.sign_keys.g_gamma_i.point = bufferToHex(presign.presign.sign_keys.g_gamma_i.point as Uint8Array)
  presign.presign.sign_keys.g_w_i.point = bufferToHex(presign.presign.sign_keys.g_w_i.point as Uint8Array)
  presign.presign.sign_keys.gamma_i.scalar = bufferToHex(presign.presign.sign_keys.gamma_i.scalar as Uint8Array)
  presign.presign.sign_keys.k_i.scalar = bufferToHex(presign.presign.sign_keys.k_i.scalar as Uint8Array)
  presign.presign.sign_keys.w_i.scalar = bufferToHex(presign.presign.sign_keys.w_i.scalar as Uint8Array)

  for (let i = 0; i < presign.presign.t_vec.length; i++) {
    presign.presign.t_vec[i].point = bufferToHex(presign.presign.t_vec[i].point as Uint8Array)
  }

  return JSON.stringify(presign)
}

export function presignStateFromString(rawPresign: string): IPresignState {
  const presign = JSON.parse(rawPresign)

  presign.presign.R.point = hexToBuffer(presign.presign.R.point)

  for (let i = 0; i < presign.presign.local_key.h1_h2_n_tilde_vec.length; i++) {
    presign.presign.local_key.h1_h2_n_tilde_vec[i].N = hexToBuffer(presign.presign.local_key.h1_h2_n_tilde_vec[i].N)
    presign.presign.local_key.h1_h2_n_tilde_vec[i].g = hexToBuffer(presign.presign.local_key.h1_h2_n_tilde_vec[i].g)
    presign.presign.local_key.h1_h2_n_tilde_vec[i].ni = hexToBuffer(presign.presign.local_key.h1_h2_n_tilde_vec[i].ni)
  }

  presign.presign.local_key.keys_linear.x_i.scalar = hexToBuffer(presign.presign.local_key.keys_linear.x_i.scalar)
  presign.presign.local_key.keys_linear.y.point = hexToBuffer(presign.presign.local_key.keys_linear.y.point)

  for (let i = 0; i < presign.presign.local_key.pk_vec.length; i++) {
    presign.presign.local_key.pk_vec[i].point = hexToBuffer(presign.presign.local_key.pk_vec[i].point)
  }

  for (let i = 0; i < presign.presign.local_key.vss_scheme.commitments.length; i++) {
    presign.presign.local_key.vss_scheme.commitments[i].point = hexToBuffer(
      presign.presign.local_key.vss_scheme.commitments[i].point
    )
  }

  presign.presign.local_key.y_sum_s.point = hexToBuffer(presign.presign.local_key.y_sum_s.point)

  presign.presign.sigma_i.scalar = hexToBuffer(presign.presign.sigma_i.scalar)

  presign.presign.sign_keys.g_gamma_i.point = hexToBuffer(presign.presign.sign_keys.g_gamma_i.point)
  presign.presign.sign_keys.g_w_i.point = hexToBuffer(presign.presign.sign_keys.g_w_i.point)
  presign.presign.sign_keys.gamma_i.scalar = hexToBuffer(presign.presign.sign_keys.gamma_i.scalar)
  presign.presign.sign_keys.k_i.scalar = hexToBuffer(presign.presign.sign_keys.k_i.scalar)
  presign.presign.sign_keys.w_i.scalar = hexToBuffer(presign.presign.sign_keys.w_i.scalar)

  for (let i = 0; i < presign.presign.t_vec.length; i++) {
    presign.presign.t_vec[i].point = hexToBuffer(presign.presign.t_vec[i].point)
  }

  return presign
}

export function roundKeygenToString(roundKeygen: IMessage): string | undefined {
  if (roundKeygen.body?.Round1) {
    return round1KeygenToString(roundKeygen)
  }

  if (roundKeygen.body?.Round2) {
    return round2KeygenToString(roundKeygen)
  }

  if (roundKeygen.body?.Round3) {
    return round3KeygenToString(roundKeygen)
  }

  if (roundKeygen.body?.Round4) {
    return round4KeygenToString(roundKeygen)
  }
}

function round1KeygenToString(roundKeygen: IMessage): string {
  roundKeygen.body.Round1.com = bufferToHex(roundKeygen.body.Round1.com)

  roundKeygen.body.Round1.composite_dlog_proof_base_h1.x = bufferToHex(
    roundKeygen.body.Round1.composite_dlog_proof_base_h1.x
  )
  roundKeygen.body.Round1.composite_dlog_proof_base_h1.y = bufferToHex(
    roundKeygen.body.Round1.composite_dlog_proof_base_h1.y
  )

  roundKeygen.body.Round1.composite_dlog_proof_base_h2.x = bufferToHex(
    roundKeygen.body.Round1.composite_dlog_proof_base_h2.x
  )

  roundKeygen.body.Round1.composite_dlog_proof_base_h2.y = bufferToHex(
    roundKeygen.body.Round1.composite_dlog_proof_base_h2.y
  )

  roundKeygen.body.Round1.dlog_statement.N = bufferToHex(roundKeygen.body.Round1.dlog_statement.N)
  roundKeygen.body.Round1.dlog_statement.g = bufferToHex(roundKeygen.body.Round1.dlog_statement.g)
  roundKeygen.body.Round1.dlog_statement.ni = bufferToHex(roundKeygen.body.Round1.dlog_statement.ni)

  return JSON.stringify(roundKeygen)
}

function round2KeygenToString(roundKeygen: IMessage): string {
  roundKeygen.body.Round2.blind_factor = bufferToHex(roundKeygen.body.Round2.blind_factor)
  roundKeygen.body.Round2.y_i.point = bufferToHex(roundKeygen.body.Round2.y_i.point)

  return JSON.stringify(roundKeygen)
}

function round3KeygenToString(roundKeygen: IMessage): string {
  for (let i = 0; i < roundKeygen.body.Round3[0].commitments.length; i++) {
    roundKeygen.body.Round3[0].commitments[i].point = bufferToHex(roundKeygen.body.Round3[0].commitments[i].point)
  }

  roundKeygen.body.Round3[1].scalar = bufferToHex(roundKeygen.body.Round3[1].scalar)

  return JSON.stringify(roundKeygen)
}

function round4KeygenToString(roundKeygen: IMessage): string {
  roundKeygen.body.Round4.challenge_response.scalar = bufferToHex(roundKeygen.body.Round4.challenge_response.scalar)
  roundKeygen.body.Round4.pk.point = bufferToHex(roundKeygen.body.Round4.pk.point)
  roundKeygen.body.Round4.pk_t_rand_commitment.point = bufferToHex(roundKeygen.body.Round4.pk_t_rand_commitment.point)

  return JSON.stringify(roundKeygen)
}

export function roundKeygenFromString(roundKeygen: string): IMessage | undefined {
  const parsed = JSON.parse(roundKeygen)

  if (parsed.body?.Round1) {
    return round1KeygenFromString(parsed)
  }

  if (parsed.body?.Round2) {
    return round2KeygenFromString(parsed)
  }

  if (parsed.body?.Round3) {
    return round3KeygenFromString(parsed)
  }

  if (parsed.body?.Round4) {
    return round4KeygenFromString(parsed)
  }
}

function round1KeygenFromString(parsed: IMessage): IMessage {
  parsed.body.Round1.com = hexToBuffer(parsed.body.Round1.com)

  parsed.body.Round1.composite_dlog_proof_base_h1.x = hexToBuffer(parsed.body.Round1.composite_dlog_proof_base_h1.x)
  parsed.body.Round1.composite_dlog_proof_base_h1.y = hexToBuffer(parsed.body.Round1.composite_dlog_proof_base_h1.y)

  parsed.body.Round1.composite_dlog_proof_base_h2.x = hexToBuffer(parsed.body.Round1.composite_dlog_proof_base_h2.x)

  parsed.body.Round1.composite_dlog_proof_base_h2.y = hexToBuffer(parsed.body.Round1.composite_dlog_proof_base_h2.y)

  parsed.body.Round1.dlog_statement.N = hexToBuffer(parsed.body.Round1.dlog_statement.N)
  parsed.body.Round1.dlog_statement.g = hexToBuffer(parsed.body.Round1.dlog_statement.g)
  parsed.body.Round1.dlog_statement.ni = hexToBuffer(parsed.body.Round1.dlog_statement.ni)

  return parsed
}

function round2KeygenFromString(parsed: IMessage): IMessage {
  parsed.body.Round2.blind_factor = hexToBuffer(parsed.body.Round2.blind_factor)
  parsed.body.Round2.y_i.point = hexToBuffer(parsed.body.Round2.y_i.point)

  return parsed
}

function round3KeygenFromString(parsed: IMessage): IMessage {
  for (let i = 0; i < parsed.body.Round3[0].commitments.length; i++) {
    parsed.body.Round3[0].commitments[i].point = hexToBuffer(parsed.body.Round3[0].commitments[i].point)
  }

  parsed.body.Round3[1].scalar = hexToBuffer(parsed.body.Round3[1].scalar)

  return parsed
}

function round4KeygenFromString(parsed: IMessage): IMessage {
  parsed.body.Round4.challenge_response.scalar = hexToBuffer(parsed.body.Round4.challenge_response.scalar)
  parsed.body.Round4.pk.point = hexToBuffer(parsed.body.Round4.pk.point)
  parsed.body.Round4.pk_t_rand_commitment.point = hexToBuffer(parsed.body.Round4.pk_t_rand_commitment.point)

  return parsed
}
