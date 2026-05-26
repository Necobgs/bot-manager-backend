export default function hasDuplicates<T>(arr: T[]): boolean {
  return new Set(arr).size !== arr.length;
}