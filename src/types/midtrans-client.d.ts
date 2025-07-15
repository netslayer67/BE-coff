// File: src/types/midtrans-client.d.ts

declare module 'midtrans-client' {
  // Mendefinisikan class Snap yang akan kita gunakan
  class Snap {
    constructor(options: { 
      isProduction: boolean; 
      serverKey: string; 
      clientKey: string 
    });
    
    // Mendefinisikan metode createTransaction
    createTransaction(parameter: any): Promise<any>;
  }

  // Mendefinisikan apa yang di-ekspor oleh modul
  const midtransClient: {
    Snap: typeof Snap;
  };

  export = midtransClient;
}