import { NextRequest } from "next/server";

export async function GET() {
    return new Response(JSON.stringify({ message: 'Hello, World!' }), {
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function POST(request:NextRequest) {
    const data = await request.json();
    return new Response(JSON.stringify({ message: 'Data received', data }), {
        headers: { 'Content-Type': 'application/json' },
    });
}