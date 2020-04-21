
interface String {
  unescape(): string;
  replaceAll(search: string, replacement: string): string;
  capitalize(): string;
  pluriel(): string;
  replaceAt(index: number, replacement: string): string;
}

interface Array<T> {
  unescapeAll(): Array<T>;
  trimAll(): Array<T>;
  copy(): Array<T>;
  removeDuplicate(): Array<T>;
}

interface Number {
  toRoman(): string;
}
