type MessageHandler<T> = (e: MessageEvent<T>) => void;

export enum WORKERS {
  tileFill,
}

export default class WorkerUtil<HandlerType> {
  #worker;

  protected readonly workers = {
    [WORKERS.tileFill]: new Worker(
      new URL('../public/workers/tile-fill.ts', import.meta.url)
    ),
  };

  constructor(
    workerPath: WORKERS,
    onMessageHandler: MessageHandler<HandlerType>
  ) {
    this.#worker = this.workers[workerPath];
    this.#worker.onmessage = onMessageHandler;
  }

  get worker() {
    return this.#worker;
  }

  postMessage<T>(message: T) {
    if (window.Worker) {
      this.#worker.postMessage(message);
    }
  }

  terminate() {
    if (window.Worker) {
      this.#worker.terminate();
    }
  }
}
