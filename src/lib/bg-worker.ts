import { pipeline, env } from '@huggingface/transformers';

// Skip local file checks (required for browser environments)
env.allowLocalModels = false;

class PipelineSingleton {
    // Bypasses the task string strict typing
    static task = 'background-removal' as any;
    static model = 'onnx-community/BEN2-ONNX';
    static instance: any = null;

    // Replaced `Function` with a specific function signature to satisfy TS
    static async getInstance(progress_callback?: (info: any) => void) {
        if (this.instance === null) {
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

// Listen for messages from the main UI thread
self.addEventListener('message', async (event) => {
    const { imageUrl } = event.data;

    try {
        // Get or initialize the AI pipeline
        const segmenter = await PipelineSingleton.getInstance((data: any) => {
            // Send download progress back to the UI
            self.postMessage({ status: 'progress', data });
        });

        const result = await segmenter(imageUrl);

        let imgBlob: Blob;

        // Extract the image blob
        if (Array.isArray(result) && result[0] && typeof result[0].toBlob === 'function') {
            imgBlob = await result[0].toBlob('image/png');
        } else if (result && typeof result.toBlob === 'function') {
            imgBlob = await result.toBlob('image/png');
        } else {
            throw new Error("Unknown result format from transformers.js");
        }

        // Send the finished transparent blob back to the main thread
        self.postMessage({ status: 'complete', blob: imgBlob });

    } catch (error: any) {
        self.postMessage({ status: 'error', error: error.message });
    }
});