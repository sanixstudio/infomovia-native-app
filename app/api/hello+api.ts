export async function GET(request: Request) {
  return new Response("Hello, world!");
}

export async function POST(request: Request) {
  const body = await request.json();
  return new Response(
    JSON.stringify({ message: "POST request received", data: body }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function PUT(request: Request) {
  return new Response("PUT request received");
}

export async function DELETE(request: Request) {
  return new Response("DELETE request received");
}
