export function generateId(lastId: string, companyCode: string) {
  const lastIdNumber = parseInt(lastId.slice(1));
  const newIdNumber = lastIdNumber + 1;
  return `S-${companyCode}-${newIdNumber}`;
}
