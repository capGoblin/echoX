import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  const { endpoint, model, prompt, headers } = await req.json();
  const openai = new OpenAI({
    baseURL: endpoint,
    apiKey: "",
    dangerouslyAllowBrowser: true,
  });

  

  
   try {
    const completion = await openai.chat.completions.create(
        {
          messages: [{ role: "system", content: prompt }],
          model: model,
        },
        {
          headers: {
            ...headers,
          },
        }
      );
    
    return NextResponse.json(completion);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
} 