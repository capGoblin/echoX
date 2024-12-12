declare module '@0glabs/0g-serving-broker' {
  export function createZGServingNetworkBroker(wallet: any): Promise<{
    settleFee: (provider: string, name: string, amount: number) => Promise<void>;
    getServiceMetadata: (provider: string, name: string) => Promise<{
      endpoint: string;
      model: string;
    }>;
    getRequestHeaders: (provider: string, name: string, prompt: string) => Promise<Record<string, string>>;
    listService: () => Promise<Array<{
      provider: string;
      name: string;
    }>>;
  }>;
} 