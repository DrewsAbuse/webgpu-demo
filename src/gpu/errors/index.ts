import type {GPU, NotInitializedGPU} from '../types/gpu.ts';

export const quitIfWebGPUNotAvailable: (gpu: NotInitializedGPU) => asserts gpu is GPU = (
  gpu: NotInitializedGPU
): asserts gpu is GPU => {
  if (!gpu.device) {
    quitIfAdapterNotAvailable(gpu.adapter);
    showErrorDialog('Unable to get a device for an unknown reason');

    return;
  }

  gpu.device.lost.then(reason => {
    showErrorDialog(`Device lost ("${reason.reason}"):\n${reason.message}`);
  });
  gpu.device.onuncapturederror = ev => {
    showErrorDialog(`Un-captured error:\n${ev.error.message}`);
  };
};

const quitIfAdapterNotAvailable: (adapter: GPUAdapter | null | undefined) => asserts adapter = (
  adapter: GPUAdapter | null | undefined
): asserts adapter => {
  if (!('gpu' in navigator)) {
    showErrorDialog('navigator.gpu is not defined - WebGPU not available in this browser');
  }

  if (!adapter) {
    showErrorDialog("requestAdapter returned null - this sample can't run on this system");
  }
};

export const showErrorDialog = (() => {
  type ErrorOutput = {show: (msg: string) => void};

  const createErrorOutput = () => {
    if (typeof document === 'undefined') {
      // Not implemented in workers.
      return {
        show: (msg: string) => {
          console.error(msg);
        },
      };
    }

    const dialogBox = document.createElement('dialog');
    dialogBox.close();
    document.body.append(dialogBox);

    const dialogText = document.createElement('pre');
    dialogText.style.whiteSpace = 'pre-wrap';
    dialogBox.append(dialogText);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'OK';
    closeBtn.onclick = () => dialogBox.close();
    dialogBox.append(closeBtn);

    return {
      show: (msg: string) => {
        // Don't overwrite the dialog message while it's still open
        // (show the first error, not the most recent error).
        if (!dialogBox.open) {
          dialogText.textContent = msg;
          dialogBox.showModal();
        }
      },
    };
  };

  let output: ErrorOutput | undefined;

  return (message: string) => {
    if (!output) {
      output = createErrorOutput();
    }

    output.show(message);
    throw new Error(message);
  };
})();
