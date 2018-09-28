export enum FrequencyBand {
    Sub = "Sub", // 30-60
    Bass = "Bass", //60-120
    LowMid = "LowMid", //250-2000
    Mid = "Mid",
    HighMid = "HighMid", //2000-8000
    High = "High" //8000-20000
}

export enum Threshold {
    Sub,
    Bass = 250,
    LowMid,
    Mid,
    HighMid,
    High
}

const FrequencyRange = {
    Sub: [20,60],
    Bass: [55,130],
    LowMid: [250,500],
    Mid: [450,2000],
    HighMid: [1800,4000],
    High: [3800,6000]
}

const sampleRate = 44100;

let previousFrequencyAvg : number = 0;

export function BeatDetect(frequencyArray : Uint8Array) : boolean {
    const avg = GetAverageAmplitude(frequencyArray.slice(0,frequencyArray.length / 2));
    const isBeat = avg > previousFrequencyAvg * 1.075;
    previousFrequencyAvg = avg;
    return isBeat;
}

export function GetFrequencyBand(frequencyArray : Uint8Array, band : string) : Uint8Array {
    const fftSize = frequencyArray.length * 2;
    const freqRes = sampleRate / fftSize;;
    const start = FrequencyRange[band][0] / freqRes;
    const end = FrequencyRange[band][1] / freqRes;
    return frequencyArray.slice(start, end);
}

export function GetFrequencyBandAverage(frequencyArray : Uint8Array, band : string) : number {
    const freqRange = GetFrequencyBand(frequencyArray, band);
    let a = 0;
    freqRange.forEach(n => {
        a += n;
    });
    return a / freqRange.length;
}

export function GetAverageAmplitude(frequencyArray : Uint8Array) {
    let a = 0;
    frequencyArray.forEach(n => {
        a += n;
    });
    return a / frequencyArray.length;
}
