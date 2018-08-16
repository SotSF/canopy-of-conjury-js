
import * as request from 'request';
import * as btoa from 'btoa';


/** Transmits data to the canopy API */
export default class Transmitter {
    host: string = null;

    constructor (host) {
        this.host = host;
    }

    private _get (uri) {
        return request.get([this.host, 'api', uri].join('/'));
    }

    private _post (uri, data) {
        return request.post([this.host, 'api', uri].join('/'), data);
    }

    /** Canopy API method wrappers */
    ping () {
        return this._get('ping');
    }

    echo () {
        return this._get('echo');
    }

    clear () {
        return this._get('clear');
    }

    start () {
        return this._get('start');
    }

    stop () {
        return this._get('stop');
    }

    stats () {
        return this._get('stats');
    }

    render (canopy) {
        const data = [];

        canopy.strips.forEach((strip) => {
            strip.colors.forEach((color, i) => {
                if (i < 0 || i >= canopy.numLedsPerStrip) return;
                const { r, g, b } = color;
                data.push(r, g, b);
            });
        });

        const u8 = new Uint8Array(data);
        const b64encoded = btoa(String.fromCharCode.apply(null, u8));
        this._post('render', b64encoded);
    }
}
