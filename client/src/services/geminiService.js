export async function fetchAiTest() {
  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/ai-test`);
  const data = await res.json();
  return data.text;
}
