const personPrototype = {
    greet: '33',
};

const person = {
    name: 'Franta',
    greet: 'Cus pic',
    // prototype: 33,
};
console.log(person.__proto__);
person.__proto__ = personPrototype;
console.log(person.__proto__);
console.log(Object.getPrototypeOf(person));
console.log(Object.getOwnPropertyNames(person));

const oo = Object.create(personPrototype, {
    x: { y: 2 },
});
console.log(oo.__proto__);
console.log(Object.getPrototypeOf(oo));
console.log(Object.getOwnPropertyNames(oo));
console.log(oo.x);

console.log(Object.getPrototypeOf({ x: 42 }));
console.log(Object.hasOwn(Object.getPrototypeOf({ x: 42 }), 'x'));

// or
// Person.prototype.greet = personPrototype.greet;
