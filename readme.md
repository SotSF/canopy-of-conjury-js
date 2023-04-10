## Installation

1. Download the repository
2. Install npm packages
3. Start the node server to communicate with the canopy: `npm run server`
4. Start the Next server: `npm run start`
5. In your favority browser, navigate to `http://localhost:3000`

## Writing Patterns

#### No Processing Canvas (manipulating LEDs in strips directly)

---

- See `/src/patterns/ConcentricCircles.js` for example

```javascript
export class PatternName extends BasePattern {
  static displayName = "Pattern Name";
  static propTypes = {
    colorParam: new PatternPropTypes.Color().enableOscillation(),
    numberParam: new PatternPropTypes.Range(1, 10)
    booleanParam: new PatternPropTypes.Boolean(),
  };

  stateParam: number;

  constructor(params) {
    super(params);
    this.stateParam = someFunctionThatProducesTheParam();
  }

  // Updates the pattern state by a single "frame"
  progress() {
    super.progress();
    // ...pattern logic...
  }

  // Renders the pattern's current state onto the canopy
  render(canopy: CanopyInterface) {
    // ...render logic...
  }
}
```
