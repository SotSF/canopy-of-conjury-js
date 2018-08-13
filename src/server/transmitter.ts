
import request from 'request';
import btoa from 'btoa';


/** Transmits data to the canopy API */
export default class Transmitter {
    host: string = null;

    constructor (host) {
        this.host = host;
    }

    private _get (uri) {
        return request.get([this.host, 'api', uri].join('/')).end();
    }

    private _post (uri, data) {
        return request.post([this.host, 'api', uri].join('/'), data).end();
    }

    /** Canopy API method wrappers */
    ping () {
        this._get('ping');
    }

    echo () {
        this._get('echo');
    }

    clear () {
        this._get('clear');
    }

    start () {
        this._get('start');
    }

    stop () {
        this._get('stop');
    }

    stats () {
        this._get('stats');
    }

    render (data) {
        const u8 = new Uint8Array(data);
        const b64encoded = btoa(String.fromCharCode.apply(null, u8));
        this._post('render', b64encoded);
    }
}
