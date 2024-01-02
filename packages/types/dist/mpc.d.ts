import { SessionDevice, SessionKind } from './group';
export interface IClientData {
    clientId?: string;
    device: SessionDevice;
    partyIndex?: number;
    publicKey?: string;
}
export interface ISessionData {
    clients: {
        [k: string]: IClientData;
    };
    kind: SessionKind;
    messagesQueue: IMessage[];
    parties: number;
    processing: boolean;
    required: number;
    round: number;
    roundsRequired: number;
    sessionId: string;
    threshold: number;
}
export interface IMessage {
    body: any;
    receiver?: number;
    round: number;
    sender?: number;
    uuid: string;
}
export interface ICurvePoint {
    curve: string;
    point: Uint8Array | string;
}
export interface ICurveScalar {
    curve: string;
    scalar: Uint8Array | string;
}
export interface ILocalKey {
    h1_h2_n_tilde_vec: {
        N: Uint8Array | string;
        g: Uint8Array | string;
        ni: Uint8Array | string;
    }[];
    i: number;
    keys_linear: {
        x_i: ICurveScalar;
        y: ICurvePoint;
    };
    n: number;
    paillier_dk: {
        p: string;
        q: string;
    };
    paillier_key_vec: {
        n: string;
    }[];
    pk_vec: ICurvePoint[];
    t: number;
    vss_scheme: {
        commitments: ICurvePoint[];
        parameters: {
            share_count: number;
            threshold: number;
        };
    };
    y_sum_s: ICurvePoint;
}
export interface IPresignKey {
    R: ICurvePoint;
    i: number;
    local_key: ILocalKey;
    sigma_i: ICurveScalar;
    sign_keys: {
        g_gamma_i: ICurvePoint;
        g_w_i: ICurvePoint;
        gamma_i: ICurveScalar;
        k_i: ICurveScalar;
        w_i: ICurveScalar;
    };
    t_vec: ICurvePoint[];
}
export interface IPresignState {
    address: string;
    participants: number[];
    partyIndex: number;
    presign: IPresignKey;
}
export interface IKeyShare {
    address: string;
    localKey: ILocalKey;
    publicKey: ArrayBuffer;
}
