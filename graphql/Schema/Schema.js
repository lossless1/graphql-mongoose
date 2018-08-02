let {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean
} = require('graphql/type');

let ToDoMongo = require('../../mongoose/todo.js');

function getProjection(fieldASTs) {
    return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
        projections[selection.name.value] = true;
        return projections;
    }, {});
}

let todoType = new GraphQLObjectType({
    name: 'todo',
    description: 'todo item',
    fields: () => ({
        itemId: {
            type: (GraphQLInt),
            description: 'The id of the todo.',
        },
        item: {
            type: GraphQLString,
            description: 'The name of the todo.',
        },
        completed: {
            type: GraphQLBoolean,
            description: 'Completed todo? '
        }
    })
});

let schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            todo: {
                type: new GraphQLList(todoType),
                args: {
                    itemId: {
                        name: 'itemId',
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve: (root, { itemId }, source, fieldASTs) => {
                    let projections = getProjection(fieldASTs);
                    return new Promise((resolve, reject) => {
                        ToDoMongo.find({ itemId }, projections, (err, todos) => {
                            err ? reject(err) : resolve(todos)
                        })
                    });
                }
            }
        }
    })
});

module.exports = schema;
