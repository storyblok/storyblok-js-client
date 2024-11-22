export function headersToObject(headers) {
  const obj = {}
  for (const [key, value] of headers.entries()) {
    obj[key] = value
  }
  return obj
}
