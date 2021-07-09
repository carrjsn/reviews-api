const add = (x, y) => {
  return x + y;
}

test('should add two numbers', () => {
  let sum = add(4, 5);
  expect(sum).toBe(9);
});