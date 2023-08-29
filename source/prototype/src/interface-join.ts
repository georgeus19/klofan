interface Entity {
    id: string;
    name: string;
}

interface TypeInfo {
    type: string;
}

function f(): Entity & TypeInfo {
    return {
        id: '1',
        name: 'honza',
        type: 'integer',
    };
}

interface Model {
    f(): Entity;
}

interface TypeModel {
    f(): TypeInfo;
}

type MM = Model & TypeModel;
// interface MergeModel extends Model, TypeModel {

// }
const y = {
    f: function () {},
} as MM;
y.f();
const xx = f();
