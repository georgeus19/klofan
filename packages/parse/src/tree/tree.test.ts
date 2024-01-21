import { describe, expect, test } from '@jest/globals';
import { isNotPrimitiveType, isPrimitiveType } from './tree';

describe('Parse Tests', () => {
    describe('Utils', () => {
        describe('Primitive type', () => {
            test('String', () => {
                const input = 'salad';
                const expectedResult = true;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Number', () => {
                const input = 2;
                const expectedResult = true;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Symbol', () => {
                const input = Symbol(1);
                const expectedResult = true;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
            test('null', () => {
                const input = null;
                const expectedResult = true;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
            test('undefined', () => {
                const input = undefined;
                const expectedResult = true;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Boolean false', () => {
                const input = false;
                const expectedResult = true;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Boolean true', () => {
                const input = true;
                const expectedResult = true;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Empty Object', () => {
                const input = {};
                const expectedResult = false;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Empty Array', () => {
                const input: object = [];
                const expectedResult = false;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Object', () => {
                const input = { name: 'Salad', size: 100 };
                const expectedResult = false;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Array', () => {
                const input = ['Salad', 'Cucumber'];
                const expectedResult = false;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Arrow function', () => {
                const input = () => {};
                const expectedResult = false;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Function', () => {
                const input = function () {};
                const expectedResult = false;
                expect(isPrimitiveType(input)).toEqual(expectedResult);
            });
        });
        describe('Not primitive type', () => {
            test('String', () => {
                const input = 'salad';
                const expectedResult = false;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Number', () => {
                const input = 2;
                const expectedResult = false;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Symbol', () => {
                const input = Symbol(1);
                const expectedResult = false;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
            test('null', () => {
                const input = null;
                const expectedResult = false;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
            test('undefined', () => {
                const input = undefined;
                const expectedResult = false;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Boolean false', () => {
                const input = false;
                const expectedResult = false;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Boolean true', () => {
                const input = true;
                const expectedResult = false;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Empty Object', () => {
                const input = {};
                const expectedResult = true;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Empty Array', () => {
                const input: object = [];
                const expectedResult = true;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Object', () => {
                const input = { name: 'Salad', size: 100 };
                const expectedResult = true;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Array', () => {
                const input = ['Salad', 'Cucumber'];
                const expectedResult = true;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Arrow function', () => {
                const input = () => {};
                const expectedResult = true;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
            test('Function', () => {
                const input = function () {};
                const expectedResult = true;
                expect(isNotPrimitiveType(input)).toEqual(expectedResult);
            });
        });
    });
});
