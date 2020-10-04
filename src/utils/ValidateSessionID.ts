export default function validateSessionID(id: string): boolean {
  return /^[a-z0-9]{5}$/i.test(id);
}
