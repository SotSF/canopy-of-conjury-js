export const TotalBands = 6;

export enum FrequencyBand {
    Sub = "Sub", // 30-60
    Bass = "Bass", //60-120
    LowMid = "LowMid", //250-2000
    Mid = "Mid",
    HighMid = "HighMid", //2000-8000
    High = "High" //8000-20000
}

const FrequencyRange = {
    Sub: [20,60],
    Bass: [61,120],
    LowMid: [201,500],
    Mid: [501,2000],
    HighMid: [2001,4000],
    High: [4001,6000]
}

const sampleRate = 44100;

let prevFreq : Uint8Array = new Uint8Array();

export function BeatDetect(frequencyArray : Uint8Array, band? : string) : boolean {
    const prev = band ? GetFrequencyBand(prevFreq,band) : prevFreq.slice(0,prevFreq.length / 2);
    const curr = band ? GetFrequencyBand(frequencyArray,band) : frequencyArray.slice(0,frequencyArray.length / 2) ;
    const previousFrequencyAvg = GetAverageAmplitude(prev);
    const avg = GetAverageAmplitude(curr);
    const isBeat = avg > previousFrequencyAvg * 1.05;
    return isBeat;
}

export function GetBand(index: number) {
    switch (index) {
        case 0: return FrequencyBand.Sub;
        case 1: return FrequencyBand.Bass;
        case 2: return FrequencyBand.LowMid;
        case 3: return FrequencyBand.Mid;
        case 4: return FrequencyBand.HighMid;
        case 5: return FrequencyBand.High;
    }
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
    return GetAverageAmplitude(freqRange);
}

export function GetAverageAmplitude(frequencyArray : Uint8Array) {
    let a = 0;
    frequencyArray.forEach(n => {
        a += n;
    });
    return a / frequencyArray.length;
}

export function PreviousFrequency(frequencyArray : Uint8Array) {
    prevFreq = frequencyArray;
}
