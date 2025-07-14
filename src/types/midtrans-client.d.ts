// File: src/types/midtrans-client.d.ts

declare module 'midtrans-client' {
  class Snap {
    constructor(options: { isProduction: boolean; serverKey: string; clientKey: string });
    createTransaction(parameter: any): Promise<any>;
  }

  // Anda bisa menambahkan class lain seperti CoreApi jika diperlukan
  // class CoreApi { ... }

  const midtransClient: {
    Snap: typeof Snap;
  };

  export = midtransClient;
}