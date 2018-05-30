
import canopy from '../canopy';
import compute from './compute';

class Catenary {
    initialize () {
        const catenaryCoords = new Array(canopy.numLedsPerStrip);
        for (let i = 0; i < catenaryCoords.length; i++) {
            catenaryCoords[i] = new Array(2);
        }

        this.coordinates = catenaryCoords;
        this.update();
    }

    /** Updates the coordinates for the catenaries */
    update () {
        const apexCoord = { x: canopy.apexRadius, y: canopy.apexHeight };
        const baseCoord = { x: canopy.baseRadius, y: 0 };
        const newCoords = compute(baseCoord, apexCoord, canopy.stripLength, canopy.numLedsPerStrip);

        for (let i = 0; i < newCoords.length; i++) {
            this.coordinates[i][0] = newCoords[i][0];
            this.coordinates[i][1] = newCoords[i][1];
        }
    }
}

export default new Catenary;
