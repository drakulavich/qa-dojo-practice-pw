export function isArray(input: any): boolean {
  return Array.isArray(input);
}

export function cloneArray<T>(arr: T[]): T[] {
  return [...arr];
}

export function first<T>(arr: T[], n = 1): T[] {
  return arr.slice(0, n);
}

export function last<T>(arr: T[], n = 1): T[] {
  return arr.slice(-n);
}

export function combine<T>(arr: T[], separator: string = ","): string {
  return arr.join(separator);
}

export function dash(input: string | number): string {
  const str = String(input);
  let result = "";

  for (let i = 0; i < str.length - 1; i++) {
    const currentDigit = parseInt(str[i]);
    const nextDigit = parseInt(str[i + 1]);

    result += str[i];

    // Add dash if both digits are even
    if (currentDigit % 2 === 0 && nextDigit % 2 === 0) {
      result += "-";
    }
  }
  // add last digit
  result += str.slice(-1);

  return result;
}

export function sort(arr: number[]): number[] {
  const sortedArray = [...arr];

  return sortedArray.sort((a, b) => a - b);
}

export function arrFromNumber(n: number): number[] {
  const arr = new Array(n);

  for (let i = 1; i <= n; i++) {
    arr[i - 1] = i;
  }

  return arr;
}

export function arrFromNumberReversed(n: number): number[] {
  const arr = new Array(n);

  for (let i = 1; i <= n; i++) {
    arr[i - 1] = n + 1 - i;
  }

  return arr;
}

export function arrSum(n: number): number {
  let sum = 0;

  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
}

export function maxNumber(a: number, b: number): number | string {
  if (a > b) return a;
  if (b > a) return b;
  return "equals";
}
