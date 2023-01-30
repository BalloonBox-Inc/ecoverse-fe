export const CANDY_MACHINE_ID = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID ?? '';
export const SECRET = JSON.parse(
  process.env.NEXT_PUBLIC_THIRD_PARTY_SECRET ?? '[]'
);
