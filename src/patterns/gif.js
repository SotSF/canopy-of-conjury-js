import { PCanvas } from "./canvas";

export class Gif {
    static menuParams = [
        {name: "Filepath", defaultVal: "", type: "GIF"},
        {name: "Blob", type: "FILE"}
    ];
    static displayName = 'Play Gif';
    constructor(params) {
        this.canvas = new PCanvas();
        this.frames = [];
        const reader = new FileReader();
        reader.readAsDataURL(params.Blob);
        reader.addEventListener('load', () => {
            gifFrames({ url: reader.result, frames: 'all', outputType: 'canvas' }).then((frameData) => 
            {
                frameData.forEach(frame => {
                    this.frames.push(frame.getImage())
                })
            });
        })
      
        this.index = 0;
    }
    scrapeImage(img, processing) {
        const data = img.data; // uint8array, [r,g,b,a,r,g,b,a,r,g,b,a...]
        const width = img.width;
        processing.pg.loadPixels();
        for (let x = 0; x < PCanvas.dimension; x++) {
            for (var y = 0; y < PCanvas.dimension; y++) {
                const i = y * (width * 4) + (x * 4);
                const c = processing.color(data[i], data[i+1], data[i+2]);
                //processing.pg.set(x,y,c);
                
                processing.pg.pixels.setPixel(y * width + x, c);
                
            }
        }
        processing.pg.updatePixels();
        
    }

    progress () {
        if (this.frames.length == 0) return;
        const { processing } = this.canvas;
        processing.pg.beginDraw();
        processing.pg.background(0);
        const img = this.frames[this.index].getContext('2d').getImageData(0,0,PCanvas.dimension,PCanvas.dimension);
        this.scrapeImage(img, processing);
        processing.pg.endDraw();

        this.index++;
        if (this.index == this.frames.length) { this.index = 0; }
    }

    render(canopy) {
        this.canvas.render(canopy);
    }
}
