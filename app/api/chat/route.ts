import { NextResponse } from 'next/server';
import groqClient from '@/lib/groqclient';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log(messages, "messages in route.ts");

    const systemPrompt = {
      role: "system",
      content: `You are an intelligent task management assistant integrated into a dashboard application. 
      
Your goal is to help users organize their projects, prioritize tasks, and manage their workflow efficiently. 
The app tracks document sections/tasks with properties: header, type, status (Done, In Process, etc.), target, limit, and reviewer.

Guidelines:
1. Be concise, encouraging, and professional.
2. If the user asks for help with tasks, offer strategies like breaking them down, prioritization (Eisenhower Matrix), or time management (Pomodoro).
3. If the user asks about the app's data, remind them that (currently) you interpret their questions based on general principles, but can guide them on how to update statuses or manage the list.
4. Keep responses short and chatty, suitable for a small chat window side-panel.`
    };

    const completion = await groqClient.chat.completions.create({
      messages: [systemPrompt, ...messages],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
