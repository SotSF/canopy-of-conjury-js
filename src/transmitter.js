
import request from 'superagent';


/**
 * Transmits data to the canopy API
 */
export default class Transmitter {
    constructor (host) {
        this.host = host;
    }

    _get (uri) {
        return request.get([this.host, 'api', uri].join('/')).end();
    }

    _post (uri, data) {
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
        var u8 = new Uint8Array(data);
        var b64encoded = btoa(String.fromCharCode.apply(null, u8));
        this._post('render', b64encoded);
    }
}
