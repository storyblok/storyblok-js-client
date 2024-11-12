export function headersToObject(headers: Headers) {
  const obj: { [key: string]: string } = {}
  for (const [key, value] of headers.entries()) {
    obj[key] = value
  }
  return obj
}
