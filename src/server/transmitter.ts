import { combine } from "../colors";
import { AppConfig } from "./types";
import got from "got";
import btoa from "btoa";
import { CanopyInterface } from "@/types";

/** Transmits data to the canopy API */
export default class Transmitter {
  uriBase: string;

  constructor(config: AppConfig) {
    this.uriBase = `http://${config.host}:${config.port}`;
  }

  private _get(uri: string) {
    return got.get([this.uriBase, "api", uri].join("/"));
  }

  private _post(uri: string, data: any) {
    return got.post([this.uriBase, "api", uri].join("/"), { body: data });
  }

  /** Canopy API method wrappers */
  ping() {
    return this._get("ping");
  }

  echo() {
    return this._get("echo");
  }

  clear() {
    return this._get("clear");
  }

  start() {
    return this._get("start");
  }

  stop() {
    return this._get("stop");
  }

  stats() {
    return this._get("stats");
  }

  render(canopy: CanopyInterface) {
    const data: number[] = [];

    canopy.strips.forEach((strip) => {
      strip.leds.forEach((led, i) => {
        // led : Color[]
        if (i < 0 || i >= canopy.stripLength) return;
        const combined = combine(led);
        const { r, g, b } = combined;
        data.push(r, g, b);
      });
    });

    const u8 = new Uint8Array(data);
    const b64encoded = btoa(String.fromCharCode(...u8));
    this._post("render", b64encoded);
  }
}
