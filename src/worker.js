self.addEventListener('message', function(e) {
    let c = _mapToCanopy(e.data.coord[0], e.data.coord[1]);
    self.postMessage({carte: e.data.coord, rad: c});
}, false);

var NUM_STRIPS = 96;

function _mapToCanopy(x,y) {
    let theta = 0;
    if (x == 0) {
        if (y > 0) theta = Math.PI / 2;
        if (y < 0) theta = -Math.PI / 2;
        if (y == 0) theta = 0;
    } else {
        theta = Math.atan2(y,x);
    }
    const radius = Math.sqrt(x * x + y * y) * 3;
    let thetaDegrees = theta * 180 / Math.PI;
    if (thetaDegrees < 0) { thetaDegrees += 360; }
    const s = Math.floor(thetaDegrees * NUM_STRIPS / 360);
    const l = Math.floor(radius / 3);
    return [s,l];
}