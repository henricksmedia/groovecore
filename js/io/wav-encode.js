/**
 * GrooveCore — js/io/wav-encode.js  (WS-B)
 *
 * AudioBuffer → 16-bit PCM stereo WAV (RIFF/WAVE, format 1).
 *
 * - Mono inputs are duplicated to both channels; >2 channels use the first two.
 * - Samples are clamped to [-1, 1] and scaled to signed 16-bit.
 * - The sample rate written into the header is the buffer's own rate (the
 *   exporter renders offline at 44.1 kHz, so files are 44100 Hz stereo).
 *
 * Zero dependencies, deterministic. window.GCWavEncode.encodeWav(buffer)
 * returns a Uint8Array ready to Blob/zip.
 */

function writeString(view, offset, str) {
    for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
    }
}

/**
 * encodeWav(audioBuffer) → Uint8Array
 * Accepts a native AudioBuffer, a Tone.ToneAudioBuffer (via .get()), or a
 * plain { sampleRate, left, right } object of Float32Arrays (the stems
 * exporter splits one multichannel render into many stereo files).
 */
function encodeWav(audioBuffer) {
    if (audioBuffer && typeof audioBuffer.get === 'function') {
        audioBuffer = audioBuffer.get(); // Tone.ToneAudioBuffer → AudioBuffer
    }

    let left, right, numFrames, sampleRate;
    if (audioBuffer && typeof audioBuffer.getChannelData === 'function') {
        numFrames = audioBuffer.length;
        sampleRate = Math.round(audioBuffer.sampleRate) || 44100;
        left = audioBuffer.getChannelData(0);
        right = (audioBuffer.numberOfChannels > 1)
            ? audioBuffer.getChannelData(1)
            : left;
    } else if (audioBuffer && audioBuffer.left && audioBuffer.left.length !== undefined) {
        left = audioBuffer.left;
        right = (audioBuffer.right && audioBuffer.right.length === left.length)
            ? audioBuffer.right : left;
        numFrames = left.length;
        sampleRate = Math.round(audioBuffer.sampleRate) || 44100;
    } else {
        throw new Error('encodeWav: not an AudioBuffer');
    }

    const numChannels = 2; // always stereo out

    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const dataSize = numFrames * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    // RIFF header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');

    // fmt chunk (PCM)
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);                        // chunk size
    view.setUint16(20, 1, true);                         // audio format 1 = PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);   // byte rate
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);                        // bits per sample

    // data chunk
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    let offset = 44;
    for (let i = 0; i < numFrames; i++) {
        let l = left[i];
        let r = right[i];
        l = l < -1 ? -1 : (l > 1 ? 1 : l);
        r = r < -1 ? -1 : (r > 1 ? 1 : r);
        view.setInt16(offset, l < 0 ? l * 0x8000 : l * 0x7fff, true);
        view.setInt16(offset + 2, r < 0 ? r * 0x8000 : r * 0x7fff, true);
        offset += 4;
    }

    return new Uint8Array(buffer);
}

const GCWavEncode = { encodeWav };

if (typeof window !== 'undefined') {
    window.GCWavEncode = GCWavEncode;
}

export { encodeWav };
export default GCWavEncode;
