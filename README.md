# LazyTyper for Google Docs

A user script that makes text typing appear more human-like in Google Docs and Slides, complete with realistic typos, varied typing speeds, and natural pauses between sentences.

## Features

- **Human-like typing simulation**: Mimics the natural rhythm and imperfections of human typing
- **Configurable typing speed**: Adjust minimum and maximum typing delay to match your preferred pace
- **Natural sentence breaks**: Adds configurable pauses between sentences to simulate thinking time
- **Realistic typos**: Automatically introduces and corrects typing mistakes at a customizable frequency
- **Clean interface**: Integrates seamlessly with Google Docs and Slides UI
- **Easy to use**: Simple overlay menu with intuitive controls

## Installation

1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/) for your browser
2. Create a new script and paste the entire code from `lazyTyper.js`
3. Save the script and navigate to any Google Docs document

## Usage

1. Open any Google Docs document or Google Slides presentation
2. Click on the "LazyTyper" text in the menu bar
3. Enter the text you want to type in the popup window
4. Configure the typing parameters:
   - **Typing Speed Min/Max**: Delay in milliseconds between character inputs (60-140ms recommended)
   - **Break Min/Max**: Delay in milliseconds between sentences (30000-120000ms recommended)
   - **Typo Frequency**: Percentage chance of making typos (5% recommended)
5. Click "Start Typing" to begin
6. To stop typing at any time, click the "Stop Typing" text in the menu bar

## Configuration Options

| Setting | Description | Recommended Value |
|---------|-------------|------------------|
| Typing Speed Min | Minimum delay between keystrokes | 60ms |
| Typing Speed Max | Maximum delay between keystrokes | 140ms |
| Break Min | Minimum pause between sentences | 30000ms (30s) |
| Break Max | Maximum pause between sentences | 120000ms (2min) |
| Typo Frequency | Chance of making a typo per character | 5% |

## Use Cases

- Make AI-generated content appear more naturally typed
- Simulate typing when recording demos or tutorials
- Create more realistic typing animations for presentations
- Make typing demonstrations look more authentic
- Save time by letting LazyTyper handle repetitive typing tasks

## Compatibility

- Google Chrome
- Firefox
- Edge
- Safari (with Tampermonkey)

## License

MIT License

## Disclaimer

This script is intended for legitimate use cases such as demonstrations, presentations, and education. Please use responsibly.
