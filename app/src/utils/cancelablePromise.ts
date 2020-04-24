export class CancelError extends Error {
    constructor() {
        super("The promise has been cancelled");
    }
}

export class CancelablePromise<T> {
    private promise: Promise<T>;
    private rejecter?: (reason?: any) => void;
    private catcher: ((reason: any) => PromiseLike<void> | void) | null | undefined;

    constructor(executor: (resolve: (value?: T | PromiseLike<T> | undefined) => void, reject: (reason?: any) => void) => void) {
        this.promise = new Promise<T>((resolve, reject) => {
            this.rejecter = reject;
            try {
                executor(resolve, reject);
            } catch (err) {
                reject(err);
            }
        });
    }

    then(cb: ((value: T) => T | PromiseLike<T> | void) | null | undefined): CancelablePromise<T> {
        this.promise.then(cb)
            .catch((err) => {
                if (this.catcher) {
                    this.catcher(err);
                }
            });
        return this;
    }

    catch(cb: ((reason: any) => PromiseLike<void> | void) | null | undefined): CancelablePromise<T> {
        this.catcher = cb;
        return this;
    }

    cancel() {
        if (this.rejecter) {
            this.rejecter(new CancelError());
        }
    }
}
