export const config = {
            runtime: 'edge',
            };

            export default async function handler(req) {
                if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

                    try {
                            const { text } = await req.json();
                                    const apiKey = process.env.GEMINI_API_KEY;

                                            if (!text) return new Response('No text provided', { status: 400 });

                                                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                                                                method: 'POST',
                                                                            headers: { 'Content-Type': 'application/json' },
                                                                                        body: JSON.stringify({
                                                                                                        contents: [{
                                                                                                                            parts: [{
                                                                                                                                                    text: `以下のテキストを、読者が「30秒で本質を理解できる」ように要約してください。\n\n形式：\n1. 【結論】（一言で）\n2. 【ポイント】（箇条書き3点）\n3. 【詳細】（重要な知見のみ）\n\nテキスト：\n${text}`
                                                                                                                                                                        }]
                                                                                                                                                                                        }]
                                                                                                                                                                                                    })
                                                                                                                                                                                                            });

                                                                                                                                                                                                                    const data = await response.json();
                                                                                                                                                                                                                            const summary = data.candidates[0].content.parts[0].text;

                                                                                                                                                                                                                                    return new Response(JSON.stringify({ summary }), {
                                                                                                                                                                                                                                                headers: { 'Content-Type': 'application/json' }
                                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                                            } catch (error) {
                                                                                                                                                                                                                                                                    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                        
}