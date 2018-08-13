
import compute from './compute';

class Catenary {
    constructor (canopy) {
        this.canopy = canopy;
        this.initialize();
    }

    initialize () {
        const catenaryCoords = new Array(this.canopy.numLedsPerStrip);
        for (let i = 0; i < catenaryCoords.length; i++) {
            catenaryCoords[i] = new Array(2);
        }

        this.coordinates = catenaryCoords;
        this.update();
    }

    /** Updates the coordinates for the catenaries */
    update () {
        const apexCoord = { x: this.canopy.apexRadius, y: this.canopy.apexHeight };
        const baseCoord = { x: this.canopy.baseRadius, y: 0 };

        const feetPerMeter = 3.28084;
        const stripLengthMeters = 2.5;
        const stripLength = stripLengthMeters * feetPerMeter;

        const newCoords = compute(
            baseCoord,
            apexCoord,
            stripLength,
            this.canopy.numLedsPerStrip
        );

        for (let i = 0; i < newCoords.length; i++) {
            this.coordinates[i][0] = newCoords[i][0];
            this.coordinates[i][1] = newCoords[i][1];
        }
    }
}

export default Catenary;
