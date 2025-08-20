import { test, expect } from "@playwright/test";
import {
  isArray,
  cloneArray,
  first,
  last,
  combine,
  dash,
  sort,
  arrFromNumber,
  arrSum,
  arrFromNumberReversed,
  maxNumber,
} from "./array";

test("AR-001 isArray", async () => {
  expect(isArray(18)).toBeFalsy();
  expect(isArray("QA DOJO")).toBeFalsy();
  expect(isArray({})).toBeFalsy();

  expect(isArray([1, 2, 4, 0])).toBeTruthy();
  expect(isArray([])).toBeTruthy();
});

test("AR-002 cloneArray", async () => {
  expect(cloneArray([1, 2, 4, 0])).toStrictEqual([1, 2, 4, 0]);
  expect(cloneArray([1, 2, [4, 0]])).toStrictEqual([1, 2, [4, 0]]);
});

test("AR-003 first", async () => {
  expect(first([7, 9, 0, -2])).toStrictEqual([7]);
  expect(first([7, 9, 0, -2], 3)).toStrictEqual([7, 9, 0]);
});

test("AR-004 last", async () => {
  expect(last([7, 9, 0, -2])).toStrictEqual([-2]);
  expect(last([7, 9, 0, -2], 3)).toStrictEqual([9, 0, -2]);
});

test("AR-005 combine", async () => {
  expect(combine(["Black", "Red", "White"])).toBe("Black,Red,White");
  expect(combine(["Black", "Red", "White"], "+")).toBe("Black+Red+White");
});

test("AR-006 dashes", async () => {
  expect(dash("025468")).toBe("0-254-6-8");
  expect(dash("135246")).toBe("1352-4-6");
  expect(dash("1024")).toBe("10-2-4");
  expect(dash("1357")).toBe("1357");
});

test("AR-007 sort", async () => {
  expect(sort([-3, 8, 7, 6, 5, -4, 3, 2, 1])).toStrictEqual([
    -4, -3, 1, 2, 3, 5, 6, 7, 8,
  ]);
});

test("AR-008 arrFromNumber", async () => {
  expect(arrFromNumber(5)).toStrictEqual([1, 2, 3, 4, 5]);
});

test("AR-009 arrSum", async () => {
  expect(arrSum(100)).toBe(5050);
  expect(arrSum(10)).toBe(55);
});

test("AR-010 arrFromNumberReversed", async () => {
  expect(arrFromNumberReversed(5)).toStrictEqual([5, 4, 3, 2, 1]);
});

test("AR-011 maxNumber", async () => {
  expect(maxNumber(10, 20)).toBe(20);
  expect(maxNumber(-10, 0)).toBe(0);

  expect(maxNumber(5, 5)).toBe("equals");
});
