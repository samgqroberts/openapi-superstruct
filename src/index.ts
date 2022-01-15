export interface Params {
  input: string
}

export async function generate({
  input,
}: Params): Promise<void> {
  console.log('Input: ', input)
}