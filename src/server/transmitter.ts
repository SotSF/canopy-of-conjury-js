
import * as WebSocket from 'ws';
import { NUM_ROWS, TOTAL_LEDS } from '../grid';
import { combine, RGB } from '../colors';
import { GridInterface } from '../types';

let frame: Uint8ClampedArray;
let socket;

/**
 * In the Open Pixel Control protocol (OPC), every pixel requires 3 bytes, one each for the red,
 * green and blue color channels. The order of the colors depends on the configuration. Furthermore
 * there is a 4-byte header
 */
const paintIndex = (pixelNumber: number, color: RGB) => {
    if (pixelNumber >= TOTAL_LEDS) {
        console.error(`Unable to paint pixel number ${pixelNumber}! Index should be less than ${TOTAL_LEDS}`);
        return;
    }

    frame[pixelNumber * 3 + 4] = color.g;
    frame[pixelNumber * 3 + 5] = color.r;
    frame[pixelNumber * 3 + 6] = color.b;
};

/**
 * The grid is mapped in successive ascending columns. The nth pixel in the array is arrived by
 * starting at the lower-left corner (pixel 0), counting up the column, then moving to the bottom of
 * the next column and counting up that column, and so on. In a 4-row by 5-col grid, the pixels
 * would be arrayed like so
 *
 *   3    7   11   15   19
 *   2    6   10   14   18
 *   1    5    9   13   17
 *   0    4    8   12   16
 */
const paintCoordinate = (x: number, y: number, color: RGB) => {
    const pixelNumber = NUM_ROWS * x + y;
    paintIndex(pixelNumber, color);
};

let _connected = false;
export const connect = ({ host, port }) => new Promise(
    (resolve, reject) => {
        // Connect to a Fadecandy server
        const uri = `ws://${host}:${port}`;
        console.log(`Connecting on \`${uri}\`...`);
        socket = new WebSocket(uri);

        // In the browser we have to use `onopen`, but the `ws` package uses the more node-canonical
        // `on('open', ...)` style
        socket.on('open', () => {
            console.log('Connected!');
            _connected = true;
            resolve();
        });

        socket.on('error', (e: Error) => {
            console.error(e.toString());
            _connected = false;
            reject();
        });
    }
);

/** Creates an OPC frame. Each pixel requires 3 bytes, and there is a 4-byte header */
const initializeFrame = () => frame = new Uint8ClampedArray(4 + TOTAL_LEDS * 3);

/** Sends the current frame */
const send = () => {
    if (socket.readyState !== 1 /* OPEN */) {
        // The server connection isn't open. Nothing to do.
        return;
    }

    if (socket.bufferedAmount > frame.length) {
        // The network is lagging, and we still haven't sent the previous frame.
        // Don't flood the network, it will just make us laggy.
        // If fcserver is running on the same computer, it should always be able
        // to keep up with the frames we send, so we shouldn't reach this point.
        return;
    }

    socket.send(frame);
};

export const render = (grid: GridInterface) => {
    initializeFrame();

    grid.strips.forEach((strip, col) =>
        strip.leds.forEach((led, row) =>
            paintCoordinate(col, row, combine(led))
        )
    );

    send();
}
