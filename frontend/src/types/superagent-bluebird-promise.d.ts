declare module 'superagent-bluebird-promise' {
  interface Response {
    body: any;
    text: string;
    status: number;
    ok: boolean;
    headers: Record<string, string>;
    type: string;
  }

  interface Request extends Promise<Response> {
    set(field: string, value: string | undefined): this;
    send(data?: any): this;
    query(data: any): this;
    attach(field: string, file: any, options?: any): this;
    field(name: string, value: any): this;
    responseType(type: string): this;
    timeout(ms: number | {deadline?: number; response?: number}): this;
    then<T>(onFulfilled?: (res: Response) => T | PromiseLike<T>, onRejected?: (err: any) => T | PromiseLike<T>): Promise<T>;
    catch<T>(onRejected?: (err: any) => T | PromiseLike<T>): Promise<T>;
    finally(onFinally?: () => void): Promise<Response>;
  }

  interface SuperagentPromise {
    get(url: string): Request;
    post(url: string): Request;
    put(url: string): Request;
    patch(url: string): Request;
    delete(url: string): Request;
    del(url: string): Request;
  }

  const request: SuperagentPromise;
  export = request;
}
