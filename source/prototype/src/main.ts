import fs from 'fs/promises';
// import { parseSchema } from './schema-parser';
import { SchemaModel, IEntity, Entity, IProperty, Property, ILiteral, Literal } from './schema';
import { Command, MovePropertyCommand } from './command';
import {
    IInstanceModel,
    InMemoryInstanceModel,
    IEntityInstance,
    EntityInstance,
    IPropertyInstance,
    PropertyInstance,
    ILiteralInstance,
    LiteralInstance,
} from './instance';
const args = process.argv.slice(2);
// require('util').inspect.defaultOptions.depth = null;

// async function main() {
//     console.log('args:', args);
//     const data = await fs.readFile(args[0]);
//     const obj = JSON.parse(data.toString())[0];
//     const [schema, entities, literals, instances, schemaInstanceMap]: any = parseSchema(obj);
//     // console.log(JSON.stringify(schema));
//     // console.log('entities:', entities);
//     console.log(schema);
// }

// main();
schemaAndInstanceCommandExample();

function schemaAndInstanceCommandExample() {
    /**
     * {
     *      name: 'noodles',
     *      calcium_100g: '20',
     *      nutrients: {
     *          magnesium_100g: '30'
     *      }
     * }
     * TO
     * {
     *      name: 'noodles',
     *      nutrients: {
     *          calcium_100g: '20',
     *          magnesium_100g: '30'
     *      }
     * }
     */

    const schema = new SchemaModel(null);
    const nameLiteral = new Literal('10');
    const nameProperty = new Property(schema, '100', 'name', nameLiteral.getId());
    const calciumLiteral = new Literal('11');
    const calciumProperty = new Property(schema, '101', 'calcium_100g', calciumLiteral.getId());
    const magnesiumLiteral = new Literal('12');
    const magnesiumProperty = new Property(schema, '102', 'magnesium_100g', magnesiumLiteral.getId());

    const nutrientsEntity = new Entity(schema, '1', [magnesiumProperty.getId()]);
    const nutrientsProperty = new Property(schema, '103', 'nutrients', nutrientsEntity.getId());
    const productEntity = new Entity(schema, '2', [nameProperty.getId(), calciumProperty.getId(), nutrientsProperty.getId()]);

    schema.addLiteral(nameLiteral);
    schema.addLiteral(calciumLiteral);
    schema.addLiteral(magnesiumLiteral);

    schema.addProperty(nameProperty);
    schema.addProperty(calciumProperty);
    schema.addProperty(magnesiumProperty);
    schema.addProperty(nutrientsProperty);

    schema.addEntity(nutrientsEntity);
    schema.addEntity(productEntity);

    const instanceSchema = new InMemoryInstanceModel(null);
    const noodlesInstanceLiteral = new LiteralInstance('10', 'noodles');
    const noodlesInstanceProperty = new PropertyInstance(instanceSchema, '100', noodlesInstanceLiteral.getId());
    const calciumInstanceLiteral = new LiteralInstance('11', '20');
    const calciumInstanceProperty = new PropertyInstance(instanceSchema, '101', calciumInstanceLiteral.getId());
    const magnesiumInstanceLiteral = new LiteralInstance('12', '30');
    const magnesiumInstanceProperty = new PropertyInstance(instanceSchema, '102', magnesiumInstanceLiteral.getId());

    const nutrientsInstanceEntity = new EntityInstance(instanceSchema, '1', [magnesiumInstanceProperty.getId()]);
    const nutrientsInstanceProperty = new PropertyInstance(instanceSchema, '103', nutrientsInstanceEntity.getId());
    const productInstanceEntity = new EntityInstance(instanceSchema, '2', [
        noodlesInstanceProperty.getId(),
        calciumInstanceProperty.getId(),
        nutrientsInstanceProperty.getId(),
    ]);

    instanceSchema.addLiteral(noodlesInstanceLiteral);
    instanceSchema.addLiteral(calciumInstanceLiteral);
    instanceSchema.addLiteral(magnesiumInstanceLiteral);

    instanceSchema.addProperty(nameProperty, noodlesInstanceProperty);
    instanceSchema.addProperty(calciumProperty, calciumInstanceProperty);
    instanceSchema.addProperty(magnesiumProperty, magnesiumInstanceProperty);
    instanceSchema.addProperty(nutrientsProperty, nutrientsInstanceProperty);

    instanceSchema.addEntity(nutrientsEntity, nutrientsInstanceEntity);
    instanceSchema.addEntity(productEntity, productInstanceEntity);

    const moveCommand = new MovePropertyCommand(schema, instanceSchema, calciumProperty, productEntity, nutrientsEntity);
    const [newSchema, newInstanceModel] = moveCommand.execute();
    console.log(newSchema.entity(nutrientsEntity.getId()));
    console.log(newSchema.entity(nutrientsEntity.getId())?.getProperties());
    console.log(newInstanceModel.entity(nutrientsInstanceEntity.getId()));
    console.log(newInstanceModel.entity(nutrientsInstanceEntity.getId()).getProperties());
}

function schemaModelCommandExample() {
    /**
     * { id: 1, label => { id: 2, calcium => { id: 4 } }, knows => { id: 3, calcium => { id: 4 } } }
     * to
     * { id: 1, label => { id: 2, calcium => { id: 4 }, knows => { id: 3, calcium => { id: 4 } } } }
     */
    const schema = new SchemaModel(null);
    schema.addEntity(new Entity(schema, '1', ['1', '2']));
    schema.addEntity(new Entity(schema, '2', ['3']));
    schema.addEntity(new Entity(schema, '3', ['3']));
    schema.addLiteral(new Literal('4'));
    schema.addProperty(new Property(schema, '1', 'label', '2'));
    schema.addProperty(new Property(schema, '2', 'knows', '3'));
    schema.addProperty(new Property(schema, '3', 'calcium', '4'));

    const moveCommand = new MovePropertyCommand(schema, new InMemoryInstanceModel(), schema.property('2')!, schema.entity('1')!, schema.entity('2')!);
    const newSchema = moveCommand.execute();
    // console.log(newSchema.entity('1'));
    // console.log(schema.entity('1'));
    // console.log(newSchema.entity('2'));
    // console.log(schema.entity('2'));
    // console.log(newSchema.entity('3'));
    // console.log(schema.entity('3'));
}
